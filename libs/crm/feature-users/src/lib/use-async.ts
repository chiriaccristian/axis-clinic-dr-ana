import { ApiError } from '@org/crm-data-access-auth';
import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; code: string }
  | { status: 'ready'; data: T };

/** Loads data on mount; `reload` fetches it again after a change. */
export function useAsync<T>(load: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    load()
      .then((data) => {
        if (active) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (active)
          setState({
            status: 'error',
            code: error instanceof ApiError ? error.code : 'generic',
          });
      });
    return () => {
      active = false;
    };
  }, [load, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return [state, reload] as const;
}

export function errorCode(error: unknown): string {
  return error instanceof ApiError ? error.code : 'generic';
}
