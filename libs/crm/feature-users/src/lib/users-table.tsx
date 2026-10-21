import { formatDateTime, t } from '@org/crm-util-i18n';
import type { Tenant, UserSummary } from '@org/models';

export function UsersTable({
  users,
  tenants,
}: {
  users: UserSummary[];
  /** Given only to a super admin, who sees every practice. */
  tenants?: Tenant[];
}) {
  if (users.length === 0) {
    return <p className="mt-4 text-muted">{t('users.empty')}</p>;
  }
  const tenantName = (id: string | null) =>
    id === null
      ? t('users.platform')
      : (tenants?.find((tenant) => tenant.id === id)?.name ?? '—');

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-line text-[11px] tracking-[0.1em] text-muted uppercase">
            <th className="py-2 pr-4 font-normal">{t('users.col.username')}</th>
            <th className="py-2 pr-4 font-normal">{t('users.col.email')}</th>
            <th className="py-2 pr-4 font-normal">{t('users.col.role')}</th>
            {tenants && (
              <th className="py-2 pr-4 font-normal">{t('users.col.tenant')}</th>
            )}
            <th className="py-2 pr-4 font-normal">{t('users.col.status')}</th>
            <th className="py-2 font-normal">{t('users.col.lastLogin')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-line">
              <td className="py-2 pr-4">{user.username}</td>
              <td className="py-2 pr-4">{user.email}</td>
              <td className="py-2 pr-4">{t(`role.${user.role}`)}</td>
              {tenants && (
                <td className="py-2 pr-4">{tenantName(user.tenantId)}</td>
              )}
              <td className="py-2 pr-4">{t(`status.${user.status}`)}</td>
              <td className="py-2">
                {user.lastLoginAt
                  ? formatDateTime(user.lastLoginAt)
                  : t('users.never')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
