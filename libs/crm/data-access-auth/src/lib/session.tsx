import type { AcceptInvitationInput, SessionUser } from '@org/models';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from './auth-api';

export type SessionState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: SessionUser };

export interface SessionContextValue {
  state: SessionState;
  login: (username: string, password: string) => Promise<SessionUser>;
  acceptInvitation: (input: AcceptInvitationInput) => Promise<SessionUser>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/** Loads the current session once and keeps it in sync with login/logout. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then((user) => {
        if (active)
          setState(
            user ? { status: 'authenticated', user } : { status: 'anonymous' },
          );
      })
      .catch(() => {
        if (active) setState({ status: 'anonymous' });
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const user = await authApi.login(username, password);
    setState({ status: 'authenticated', user });
    return user;
  }, []);

  const acceptInvitation = useCallback(async (input: AcceptInvitationInput) => {
    const user = await authApi.acceptInvitation(input);
    setState({ status: 'authenticated', user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setState({ status: 'anonymous' });
    }
  }, []);

  const value = useMemo(
    () => ({ state, login, acceptInvitation, logout }),
    [state, login, acceptInvitation, logout],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
