import { SessionProvider } from '@org/crm-data-access-auth';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UsersPage } from './users-page';

// Fictional data only.
const tenant = {
  id: '00000000-0000-4000-8000-0000000000aa',
  name: 'Clinica Test',
  createdAt: '2026-01-01T10:00:00Z',
};
const admin = {
  id: '00000000-0000-4000-8000-000000000001',
  tenantId: null,
  role: 'super_admin',
  username: 'test.admin',
};
const manager = {
  id: '00000000-0000-4000-8000-000000000002',
  tenantId: tenant.id,
  role: 'manager',
  username: 'test.manager',
};
const users = [
  {
    ...admin,
    email: 'admin@example.test',
    status: 'active',
    lastLoginAt: '2026-01-02T08:00:00Z',
  },
  {
    ...manager,
    email: 'manager@example.test',
    status: 'active',
    lastLoginAt: null,
  },
];

type Route = (init?: RequestInit) => [number, unknown];

function fakeApi(routes: Record<string, Route>) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const route = routes[`${init?.method ?? 'GET'} ${url}`];
    if (!route) throw new Error(`Unexpected request ${url}`);
    const [status, body] = route(init);
    return new Response(JSON.stringify(body), { status });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderPage() {
  render(
    <SessionProvider>
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    </SessionProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('UsersPage', () => {
  it('shows a super admin every user with their practice, and the practices panel', async () => {
    fakeApi({
      'GET /api/auth/me': () => [200, { data: admin }],
      'GET /api/users': () => [200, { data: users }],
      'GET /api/tenants': () => [200, { data: [tenant] }],
    });
    renderPage();

    const table = await screen.findByRole('table');
    expect(within(table).getByText('manager@example.test')).toBeTruthy();
    expect(within(table).getByText('Clinica Test')).toBeTruthy();
    expect(within(table).getByText('Platformă')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Clinici' })).toBeTruthy();
  });

  it('does not ask a manager for tenants or offer the super admin role', async () => {
    const fetchMock = fakeApi({
      'GET /api/auth/me': () => [200, { data: manager }],
      'GET /api/users': () => [200, { data: users.slice(1) }],
    });
    renderPage();

    await screen.findByRole('table');
    expect(fetchMock).not.toHaveBeenCalledWith(
      '/api/tenants',
      expect.anything(),
    );
    expect(screen.queryByRole('heading', { name: 'Clinici' })).toBeNull();
    const roleOptions = within(screen.getByLabelText('Rol'))
      .getAllByRole('option')
      .map((option) => option.textContent);
    expect(roleOptions).toEqual(['Manager clinică', 'Medic']);
  });

  it('invites a doctor into a practice and shows the link when no email was sent', async () => {
    const fetchMock = fakeApi({
      'GET /api/auth/me': () => [200, { data: admin }],
      'GET /api/users': () => [200, { data: users }],
      'GET /api/tenants': () => [200, { data: [tenant] }],
      'POST /api/invitations': () => [
        201,
        {
          data: {
            id: 'i1',
            emailed: false,
            acceptUrl:
              'https://crm.example.test/accept-invitation#token=fictional',
          },
        },
      ],
    });
    renderPage();

    await screen.findByRole('table');
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'doctor@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Rol'), {
      target: { value: 'doctor' },
    });
    fireEvent.change(screen.getByLabelText('Clinică'), {
      target: { value: tenant.id },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Trimite invitația' }));

    expect(
      await screen.findByText(
        'https://crm.example.test/accept-invitation#token=fictional',
      ),
    ).toBeTruthy();
    const call = fetchMock.mock.calls.find(
      ([url, init]) => url === '/api/invitations' && init?.method === 'POST',
    ) as unknown as [string, RequestInit];
    expect(JSON.parse(String(call[1].body))).toEqual({
      email: 'doctor@example.test',
      role: 'doctor',
      tenantId: tenant.id,
    });
  });
});
