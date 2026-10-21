import { useSession } from '@org/crm-data-access-auth';
import { t } from '@org/crm-util-i18n';
import type { Role } from '@org/models';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Shows its children only to a logged-in user (with one of `roles`, if given).
 * This only hides UI; the API checks role and practice on every request.
 */
export function RequireAuth({
  roles,
  children,
}: {
  roles?: readonly Role[];
  children: ReactNode;
}) {
  const { state } = useSession();
  const location = useLocation();

  if (state.status === 'loading') {
    return (
      <p role="status" className="p-8 text-muted">
        {t('app.loading')}
      </p>
    );
  }
  if (state.status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(state.user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
