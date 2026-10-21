import { authApi, useSession } from '@org/crm-data-access-auth';
import { errorText, t } from '@org/crm-util-i18n';
import type { SessionUser, Tenant, UserSummary } from '@org/models';
import { useCallback } from 'react';
import { InviteForm } from './invite-form';
import { Notice } from './panel';
import { TenantsPanel } from './tenants-panel';
import { useAsync } from './use-async';
import { UsersTable } from './users-table';

interface UsersPageData {
  users: UserSummary[];
  /** Only loaded for a super admin. */
  tenants: Tenant[] | undefined;
}

/** User management for super admins (all practices) and managers (own practice). */
export function UsersPage() {
  const { state } = useSession();
  if (state.status !== 'authenticated') return null;
  return <UsersPageContent actor={state.user} />;
}

function UsersPageContent({ actor }: { actor: SessionUser }) {
  const isSuperAdmin = actor.role === 'super_admin';
  const load = useCallback(async (): Promise<UsersPageData> => {
    const [users, tenants] = await Promise.all([
      authApi.listUsers(),
      isSuperAdmin ? authApi.listTenants() : Promise.resolve(undefined),
    ]);
    return { users, tenants };
  }, [isSuperAdmin]);
  const [data, reload] = useAsync(load);

  return (
    <div className="grid gap-6">
      <h1 className="font-serif text-[36px] text-wine">{t('users.title')}</h1>
      {data.status === 'loading' && (
        <p role="status" className="text-muted">
          {t('app.loading')}
        </p>
      )}
      {data.status === 'error' && (
        <Notice tone="error">{errorText(data.code)}</Notice>
      )}
      {data.status === 'ready' && (
        <>
          <section className="border border-line bg-ivory p-6">
            <UsersTable users={data.data.users} tenants={data.data.tenants} />
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            <InviteForm
              actor={actor}
              tenants={data.data.tenants ?? []}
              onInvited={reload}
            />
            {data.data.tenants && (
              <TenantsPanel tenants={data.data.tenants} onCreated={reload} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
