import { useSession } from '@org/crm-data-access-auth';
import { errorText, t } from '@org/crm-util-i18n';
import { MIN_PASSWORD_LENGTH } from '@org/models';
import { Button, Form, TextField } from '@org/ui';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout, FormError } from './auth-layout';
import { errorCode } from './error-code';

export function LoginPage() {
  const { state, login } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Where the user was going before being sent to login.
  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : '/';

  if (state.status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setSubmitting(true);
    try {
      await login(String(form.get('username')), String(form.get('password')));
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorText(errorCode(err), { min: MIN_PASSWORD_LENGTH }));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t('login.title')}>
      <Form onSubmit={onSubmit}>
        <TextField
          label={t('login.username')}
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
        <TextField
          label={t('login.password')}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <FormError message={error} />
        <Button type="submit" variant="submit" disabled={submitting}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </Button>
      </Form>
    </AuthLayout>
  );
}
