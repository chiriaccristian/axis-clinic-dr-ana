import { NotFoundError, ValidationError } from '@org/api-data';
import {
  Router,
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express';
import {
  AuthService,
  ForbiddenError,
  InvalidCredentialsError,
  type Role,
  type SessionUser,
} from './auth.service';
import type { Mailer } from './mailer';

export interface AuthHttpOptions {
  /** Public URL of the CRM app, used in invitation links. */
  appUrl: string;
  /** False only for local development over plain HTTP. */
  secureCookies: boolean;
}

const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const ROLES: readonly Role[] = ['super_admin', 'manager', 'doctor'];

export function sessionCookieName(secure: boolean): string {
  return secure ? '__Host-crm_session' : 'crm_session';
}

function readCookie(req: Request, name: string): string | null {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

/** The authenticated user; only valid after `requireAuth`. */
export function currentUser(res: Response): SessionUser {
  const user: unknown = res.locals['user'];
  if (!user) throw new Error('currentUser used without requireAuth');
  return user as SessionUser;
}

/** Express 4 does not forward rejected promises; this does. */
const handle =
  (fn: (req: Request, res: Response) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

function body(req: Request): Record<string, unknown> {
  return typeof req.body === 'object' && req.body !== null
    ? (req.body as Record<string, unknown>)
    : {};
}

function stringField(value: unknown, code: string): string {
  if (typeof value !== 'string' || value.length > 500)
    throw new ValidationError(code);
  return value;
}

/** Fixed-window limiter per client IP. Per instance, which is enough for login. */
export function rateLimit(max: number, windowMs: number): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      if (hits.size > 10_000) hits.clear();
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      res.status(429).json({
        error: { code: 'too_many_requests', message: 'Too many requests' },
      });
      return;
    }
    next();
  };
}

export function createAuthMiddleware(
  auth: AuthService,
  options: AuthHttpOptions,
) {
  const cookieName = sessionCookieName(options.secureCookies);

  const requireAuth: RequestHandler = (req, res, next) => {
    const token = readCookie(req, cookieName);
    if (!token) {
      res.status(401).json({
        error: { code: 'unauthenticated', message: 'Login required' },
      });
      return;
    }
    auth
      .authenticate(token)
      .then((user) => {
        if (!user) {
          res.status(401).json({
            error: { code: 'unauthenticated', message: 'Login required' },
          });
          return;
        }
        res.locals['user'] = user;
        next();
      })
      .catch(next);
  };

  const requireRole =
    (...roles: Role[]): RequestHandler =>
    (req, res, next) => {
      if (!roles.includes(currentUser(res).role)) {
        res
          .status(403)
          .json({ error: { code: 'forbidden', message: 'Not allowed' } });
        return;
      }
      next();
    };

  return { requireAuth, requireRole, cookieName };
}

/**
 * Routes, mounted under /api:
 *   POST /auth/login, POST /auth/logout, GET /auth/me,
 *   POST /auth/accept-invitation, POST /invitations, GET /users,
 *   GET /tenants, POST /tenants
 */
export function createAuthRouter(
  auth: AuthService,
  mailer: Mailer,
  options: AuthHttpOptions,
): Router {
  const router = Router();
  const { requireAuth, requireRole, cookieName } = createAuthMiddleware(
    auth,
    options,
  );

  const setSession = (res: Response, token: string) => {
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: options.secureCookies,
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS,
    });
  };

  router.post(
    '/auth/login',
    rateLimit(10, 60_000),
    handle(async (req, res) => {
      const input = body(req);
      const { token, user } = await auth.login(
        stringField(input['username'], 'invalid_username'),
        stringField(input['password'], 'invalid_password'),
      );
      setSession(res, token);
      res.json({ data: user });
    }),
  );

  router.post(
    '/auth/logout',
    handle(async (req, res) => {
      const token = readCookie(req, cookieName);
      if (token) await auth.logout(token);
      res.clearCookie(cookieName, { path: '/', secure: options.secureCookies });
      res.status(204).end();
    }),
  );

  router.get('/auth/me', requireAuth, (req, res) => {
    res.json({ data: currentUser(res) });
  });

  router.post(
    '/auth/accept-invitation',
    rateLimit(10, 60_000),
    handle(async (req, res) => {
      const input = body(req);
      const { token, user } = await auth.acceptInvitation({
        token: stringField(input['token'], 'invalid_token'),
        username: stringField(input['username'], 'invalid_username'),
        password: stringField(input['password'], 'weak_password'),
      });
      setSession(res, token);
      res.status(201).json({ data: user });
    }),
  );

  router.post(
    '/invitations',
    requireAuth,
    requireRole('super_admin', 'manager'),
    handle(async (req, res) => {
      const input = body(req);
      const role = input['role'];
      if (typeof role !== 'string' || !ROLES.includes(role as Role)) {
        throw new ValidationError('invalid_role');
      }
      const tenantId = input['tenantId'];
      const email = stringField(input['email'], 'invalid_email');
      const { token, invitationId } = await auth.createInvitation(
        currentUser(res),
        {
          email,
          role: role as Role,
          tenantId: typeof tenantId === 'string' ? tenantId : null,
        },
      );
      // The token travels in the fragment, so it never reaches server logs.
      const acceptUrl = `${options.appUrl}/accept-invitation#token=${token}`;
      const emailed = await mailer.sendInvitation(
        email.trim().toLowerCase(),
        acceptUrl,
      );
      res.status(201).json({
        data: {
          id: invitationId,
          emailed,
          acceptUrl: emailed ? undefined : acceptUrl,
        },
      });
    }),
  );

  router.get(
    '/users',
    requireAuth,
    requireRole('super_admin', 'manager'),
    handle(async (req, res) => {
      res.json({ data: await auth.listUsers(currentUser(res)) });
    }),
  );

  router.get(
    '/tenants',
    requireAuth,
    requireRole('super_admin'),
    handle(async (req, res) => {
      res.json({ data: await auth.listTenants(currentUser(res)) });
    }),
  );

  router.post(
    '/tenants',
    requireAuth,
    requireRole('super_admin'),
    handle(async (req, res) => {
      const name = stringField(body(req)['name'], 'invalid_name');
      res
        .status(201)
        .json({ data: await auth.createTenant(currentUser(res), name) });
    }),
  );

  return router;
}

/** Central error shape: `{ error: { code, message } }`, no internals. */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // Express recognises error handlers by their four parameters.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof InvalidCredentialsError) {
    res.status(401).json({
      error: {
        code: 'invalid_credentials',
        message: 'Invalid username or password',
      },
    });
  } else if (err instanceof ForbiddenError) {
    res
      .status(403)
      .json({ error: { code: 'forbidden', message: 'Not allowed' } });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({
      error: { code: 'not_found', message: `${err.entity} not found` },
    });
  } else if (err instanceof ValidationError) {
    res
      .status(400)
      .json({ error: { code: err.code, message: 'Invalid input' } });
  } else if (err instanceof SyntaxError) {
    res
      .status(400)
      .json({ error: { code: 'invalid_json', message: 'Invalid JSON' } });
  } else {
    // First line only: database errors list query parameters further down.
    const summary =
      err instanceof Error ? err.message.split('\n')[0] : 'unknown';
    console.error('[ error ]', req.method, req.route?.path ?? '', summary);
    res
      .status(500)
      .json({ error: { code: 'internal', message: 'Internal error' } });
  }
};
