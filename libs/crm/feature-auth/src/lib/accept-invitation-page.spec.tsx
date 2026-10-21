import { SessionProvider } from '@org/crm-data-access-auth';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AcceptInvitationPage } from './accept-invitation-page';

const TOKEN = 'fictional-invitation-token';

function fakeApi(acceptStatus: number, acceptBody: unknown) {
  const fetchMock = vi.fn(async (url: string) => {
    if (url === '/api/auth/me') {
      return new Response(
        JSON.stringify({ error: { code: 'unauthenticated', message: 'x' } }),
        { status: 401 },
      );
    }
    return new Response(JSON.stringify(acceptBody), { status: acceptStatus });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderPage(hash: string) {
  window.history.replaceState(null, '', `/accept-invitation${hash}`);
  const router = createMemoryRouter(
    [
      { path: '/accept-invitation', element: <AcceptInvitationPage /> },
      { path: '/', element: <p>home</p> },
    ],
    { initialEntries: ['/accept-invitation'] },
  );
  render(
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>,
  );
  return router;
}

function fill(username: string, password: string, confirm = password) {
  fireEvent.change(screen.getByLabelText('Nume de utilizator'), {
    target: { value: username },
  });
  fireEvent.change(screen.getByLabelText('Parolă'), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText('Confirmă parola'), {
    target: { value: confirm },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Creează contul' }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AcceptInvitationPage', () => {
  it('explains the problem when the link has no token', () => {
    fakeApi(200, {});
    renderPage('');
    expect(screen.getByRole('alert').textContent).toContain(
      'Linkul de invitație nu este complet',
    );
  });

  it('removes the token from the address bar', () => {
    fakeApi(200, {});
    renderPage(`#token=${TOKEN}`);
    expect(window.location.hash).toBe('');
  });

  it('checks the passwords match before calling the API', () => {
    const fetchMock = fakeApi(200, {});
    renderPage(`#token=${TOKEN}`);

    fill('test.doctor', 'fictional-pass-1', 'fictional-pass-2');

    expect(screen.getByRole('alert').textContent).toBe('Parolele nu coincid.');
    expect(fetchMock).not.toHaveBeenCalledWith(
      '/api/auth/accept-invitation',
      expect.anything(),
    );
  });

  it('creates the account with the token and goes to the home page', async () => {
    const fetchMock = fakeApi(201, {
      data: {
        id: 'u1',
        tenantId: 't1',
        role: 'doctor',
        username: 'test.doctor',
      },
    });
    const router = renderPage(`#token=${TOKEN}`);

    fill('Test.Doctor', 'fictional-password');

    expect(await screen.findByText('home')).toBeTruthy();
    expect(router.state.location.pathname).toBe('/');
    const call = fetchMock.mock.calls.find(
      ([url]) => url === '/api/auth/accept-invitation',
    ) as unknown as [string, RequestInit];
    expect(JSON.parse(String(call[1].body))).toEqual({
      token: TOKEN,
      username: 'test.doctor',
      password: 'fictional-password',
    });
  });

  it('shows why an expired invitation was refused', async () => {
    fakeApi(404, { error: { code: 'not_found', message: 'x' } });
    renderPage(`#token=${TOKEN}`);

    fill('test.doctor', 'fictional-password');

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Invitația nu mai este valabilă',
    );
  });
});
