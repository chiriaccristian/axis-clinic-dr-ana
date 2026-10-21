import { SessionProvider } from '@org/crm-data-access-auth';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './app';

// Fictional accounts only.
const admin = {
  id: '00000000-0000-4000-8000-000000000001',
  tenantId: null,
  role: 'super_admin',
  username: 'test.admin',
};
const doctor = {
  id: '00000000-0000-4000-8000-000000000002',
  tenantId: '00000000-0000-4000-8000-0000000000aa',
  role: 'doctor',
  username: 'test.doctor',
};

type Handler = (init: RequestInit | undefined) => [number, unknown];

/** Fakes the API by path; unknown paths fail the test loudly. */
function fakeApi(handlers: Record<string, Handler>) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const handler = handlers[`${init?.method ?? 'GET'} ${url}`];
    if (!handler) throw new Error(`Unexpected request ${url}`);
    const [status, body] = handler(init);
    return new Response(JSON.stringify(body), { status });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>,
  );
  return router;
}

const unauthenticated: Handler = () => [
  401,
  { error: { code: 'unauthenticated', message: 'Login required' } },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CRM app', () => {
  it('sends a visitor without a session to the login page', async () => {
    fakeApi({ 'GET /api/auth/me': unauthenticated });
    const router = renderAt('/');

    expect(
      await screen.findByRole('heading', { name: 'Autentificare' }),
    ).toBeTruthy();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('logs in and shows the home page with the users link for a super admin', async () => {
    const fetchMock = fakeApi({
      'GET /api/auth/me': unauthenticated,
      'POST /api/auth/login': () => [200, { data: admin }],
    });
    renderAt('/');

    fireEvent.change(await screen.findByLabelText('Utilizator'), {
      target: { value: 'test.admin' },
    });
    fireEvent.change(screen.getByLabelText('Parolă'), {
      target: { value: 'fictional-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Intră în cont' }));

    expect(
      await screen.findByRole('heading', { name: 'Bine ai venit, test.admin' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Utilizatori' })).toBeTruthy();
    const loginCall = fetchMock.mock.calls.find(
      ([url]) => url === '/api/auth/login',
    );
    expect(JSON.parse(String(loginCall?.[1]?.body))).toEqual({
      username: 'test.admin',
      password: 'fictional-password',
    });
  });

  it('shows the server error when the password is wrong', async () => {
    fakeApi({
      'GET /api/auth/me': unauthenticated,
      'POST /api/auth/login': () => [
        401,
        { error: { code: 'invalid_credentials', message: 'x' } },
      ],
    });
    renderAt('/login');

    fireEvent.change(await screen.findByLabelText('Utilizator'), {
      target: { value: 'test.admin' },
    });
    fireEvent.change(screen.getByLabelText('Parolă'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Intră în cont' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Utilizator sau parolă greșite.',
    );
  });

  it('hides user management from a doctor', async () => {
    fakeApi({ 'GET /api/auth/me': () => [200, { data: doctor }] });
    const router = renderAt('/users');

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(screen.queryByRole('link', { name: 'Utilizatori' })).toBeNull();
  });
});
