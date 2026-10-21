import { authApi } from '@org/crm-data-access-auth';
import { errorText, formatDateTime, t } from '@org/crm-util-i18n';
import type { Tenant } from '@org/models';
import { Button, Form, TextField } from '@org/ui';
import { useState, type FormEvent } from 'react';
import { Notice, Panel } from './panel';
import { errorCode } from './use-async';

export function TenantsPanel({
  tenants,
  onCreated,
}: {
  tenants: Tenant[];
  onCreated: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError(null);
    setSubmitting(true);
    try {
      await authApi.createTenant(String(new FormData(formElement).get('name')));
      formElement.reset();
      onCreated();
    } catch (err) {
      setError(errorText(errorCode(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Panel title={t('tenants.title')}>
      {tenants.length === 0 ? (
        <p className="mt-4 text-muted">{t('tenants.empty')}</p>
      ) : (
        <ul className="mt-4 grid gap-2 text-[14px]">
          {tenants.map((tenant) => (
            <li
              key={tenant.id}
              className="flex justify-between gap-4 border-b border-line pb-2"
            >
              <span>{tenant.name}</span>
              <span className="text-muted">
                {t('tenants.created')} {formatDateTime(tenant.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Form onSubmit={onSubmit}>
        <TextField
          label={t('tenants.name')}
          name="name"
          autoComplete="off"
          required
        />
        <Button type="submit" variant="submit" disabled={submitting}>
          {t('tenants.submit')}
        </Button>
      </Form>
      {error && <Notice tone="error">{error}</Notice>}
    </Panel>
  );
}
