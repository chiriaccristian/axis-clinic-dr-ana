import { useSession } from '@org/crm-data-access-auth';
import { t } from '@org/crm-util-i18n';
import { Button } from '@org/ui';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-wine underline underline-offset-4'
    : 'text-ink hover:text-wine';

/** Shell for every page behind login: header, navigation, content. */
export function CrmLayout() {
  const { state, logout } = useSession();
  const navigate = useNavigate();
  if (state.status !== 'authenticated') return null;
  const { user } = state;
  const canManageUsers = user.role === 'super_admin' || user.role === 'manager';

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blush">
      <header className="border-b border-line bg-ivory">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-4">
          <nav
            aria-label={t('app.name')}
            className="flex items-center gap-6 text-[14px]"
          >
            <span className="font-serif text-[24px] text-wine">
              {t('app.name')}
            </span>
            <NavLink to="/" end className={navLinkClass}>
              {t('app.nav.home')}
            </NavLink>
            {canManageUsers && (
              <NavLink to="/users" className={navLinkClass}>
                {t('app.nav.users')}
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-4 text-[14px]">
            <span>
              {user.username}{' '}
              <span className="text-muted">· {t(`role.${user.role}`)}</span>
            </span>
            <Button variant="nav" onClick={onLogout}>
              {t('app.logout')}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export function HomePage() {
  const { state } = useSession();
  if (state.status !== 'authenticated') return null;
  return (
    <section className="border border-line bg-ivory p-8">
      <h1 className="font-serif text-[36px] text-wine">
        {t('app.home.title', { username: state.user.username })}
      </h1>
      <p className="mt-3 text-muted">{t('app.home.body')}</p>
    </section>
  );
}

export function NotFoundPage() {
  return <p className="text-muted">{t('app.notFound')}</p>;
}
