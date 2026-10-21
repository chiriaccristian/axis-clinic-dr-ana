import { useSession } from '@org/crm-data-access-auth';
import { errorText, t } from '@org/crm-util-i18n';
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN } from '@org/models';
import { Button, Form, TextField } from '@org/ui';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, FormError } from './auth-layout';
import { errorCode } from './error-code';

/** The invitation token travels in `#token=...`, which never reaches a server. */
function readTokenFromHash(): string | null {
  return new URLSearchParams(window.location.hash.slice(1)).get('token');
}

export function AcceptInvitationPage() {
  const { acceptInvitation } = useSession();
  const navigate = useNavigate();
  const [token] = useState(readTokenFromHash);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep the token out of the address bar and browser history once read.
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username')).trim().toLowerCase();
    const password = String(form.get('password'));
    setError(null);

    if (!USERNAME_PATTERN.test(username)) {
      setError(errorText('invalid_username'));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(errorText('weak_password', { min: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (password !== String(form.get('confirm'))) {
      setError(errorText('password_mismatch'));
      return;
    }

    setSubmitting(true);
    try {
      await acceptInvitation({ token, username, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorText(errorCode(err), { min: MIN_PASSWORD_LENGTH }));
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title={t('invite.title')}>
        <p role="alert" className="mt-6 text-[14px] text-ink">
          {t('invite.missingToken')}
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('invite.title')}>
      <p className="mt-4 text-[14px] text-muted">{t('invite.intro')}</p>
      <Form onSubmit={onSubmit}>
        <div>
          <TextField
            label={t('invite.username')}
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-describedby="username-hint"
          />
          <p id="username-hint" className="mt-1 text-[12px] text-muted">
            {t('invite.usernameHint')}
          </p>
        </div>
        <div>
          <TextField
            label={t('invite.password')}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="mt-1 text-[12px] text-muted">
            {t('invite.passwordHint', { min: MIN_PASSWORD_LENGTH })}
          </p>
        </div>
        <TextField
          label={t('invite.confirm')}
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
        />
        <FormError message={error} />
        <Button type="submit" variant="submit" disabled={submitting}>
          {submitting ? t('invite.submitting') : t('invite.submit')}
        </Button>
      </Form>
    </AuthLayout>
  );
}
