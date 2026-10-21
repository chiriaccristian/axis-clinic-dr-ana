import { SessionProvider } from '@org/crm-data-access-auth';
import {
  AcceptInvitationPage,
  LoginPage,
  RequireAuth,
} from '@org/crm-feature-auth';
import { UsersPage } from '@org/crm-feature-users';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CrmLayout, HomePage, NotFoundPage } from './crm-layout';

export const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/accept-invitation', element: <AcceptInvitationPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <CrmLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'users',
        element: (
          <RequireAuth roles={['super_admin', 'manager']}>
            <UsersPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}

export default App;
