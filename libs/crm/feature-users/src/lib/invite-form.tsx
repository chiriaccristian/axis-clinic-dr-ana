import { authApi } from '@org/crm-data-access-auth';
import { errorText, t } from '@org/crm-util-i18n';
import type { InvitationResult, Role, SessionUser, Tenant } from '@org/models';
import { Button, Form, SelectField, TextField } from '@org/ui';
import { useState, type FormEvent } from 'react';
import { Notice, Panel } from './panel';
import { errorCode } from './use-async';

/** Roles each role may invite; mirrors the rule enforced by the API. */
const INVITABLE: Record<Role, readonly Role[]> = {
  super_admin: ['manager', 'doctor', 'super_admin'],
  manager: ['manager', 'doctor'],
  doctor: [],
};

export function InviteForm({
  actor,
  tenants,
  onInvited,
}: {
  actor: SessionUser;
  /** Practices a super admin can invite into; unused for a manager. */
  tenants: Tenant[];
  onInvited: () => void;
}) {
  const roles = INVITABLE[actor.role];
  const [role, setRole] = useState<Role>(roles[0] ?? 'doctor');
  const [result, setResult] = useState<InvitationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const needsTenant = actor.role === 'super_admin' && role !== 'super_admin';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setError(null);
    setResult(null);
    setCopied(false);
    setSubmitting(true);
    try {
      const invitation = await authApi.createInvitation({
        email: String(form.get('email')),
        role,
        tenantId: needsTenant
          ? String(form.get('tenantId') || '') || null
          : null,
      });
      setResult(invitation);
      formElement.reset();
      onInvited();
    } catch (err) {
      setError(errorText(errorCode(err)));
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Panel title={t('invitation.title')}>
      <Form onSubmit={onSubmit}>
        <TextField
          label={t('invitation.email')}
          name="email"
          type="email"
          autoComplete="off"
          required
        />
        <SelectField
          label={t('invitation.role')}
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as Role)}
        >
          {roles.map((option) => (
            <option key={option} value={option}>
              {t(`role.${option}`)}
            </option>
          ))}
        </SelectField>
        {needsTenant && (
          <SelectField
            label={t('invitation.tenant')}
            name="tenantId"
            defaultValue=""
            required
          >
            <option value="" disabled>
              {t('invitation.tenantPlaceholder')}
            </option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </SelectField>
        )}
        <Button type="submit" variant="submit" disabled={submitting}>
          {submitting ? t('invitation.submitting') : t('invitation.submit')}
        </Button>
      </Form>
      {error && <Notice tone="error">{error}</Notice>}
      {result?.emailed && <Notice>{t('invitation.emailed')}</Notice>}
      {result && !result.emailed && result.acceptUrl && (
        <div className="mt-3">
          <Notice>{t('invitation.notEmailed')}</Notice>
          <p className="mt-2 break-all bg-blush p-2 font-mono text-[12px]">
            {result.acceptUrl}
          </p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => copyLink(result.acceptUrl ?? '')}
          >
            {copied ? t('invitation.copied') : t('invitation.copy')}
          </Button>
        </div>
      )}
    </Panel>
  );
}
