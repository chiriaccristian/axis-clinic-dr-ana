/** Sends account emails. Returns false when no email provider is configured. */
export interface Mailer {
  sendInvitation(to: string, acceptUrl: string): Promise<boolean>;
}

/** Used when no provider is configured: nothing is sent. */
export class NoopMailer implements Mailer {
  async sendInvitation(): Promise<boolean> {
    return false;
  }
}

export interface BrevoConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
}

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

/** Transactional email through Brevo's REST API (EU provider). */
export class BrevoMailer implements Mailer {
  constructor(
    private readonly config: BrevoConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async sendInvitation(to: string, acceptUrl: string): Promise<boolean> {
    const response = await this.fetchFn(BREVO_URL, {
      method: 'POST',
      headers: {
        'api-key': this.config.apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: to }],
        subject: 'Invitație în CRM',
        htmlContent: invitationHtml(acceptUrl, this.config.senderName),
        textContent: invitationText(acceptUrl, this.config.senderName),
      }),
    });
    if (!response.ok) {
      // Only the status: the body may echo the recipient address.
      throw new Error(`brevo_send_failed_${response.status}`);
    }
    return true;
  }
}

/** Picks Brevo when its settings are present, otherwise sends nothing. */
export function createMailer(env: NodeJS.ProcessEnv): Mailer {
  const apiKey = env['BREVO_API_KEY'];
  const senderEmail = env['MAIL_FROM'];
  if (!apiKey || !senderEmail) return new NoopMailer();
  return new BrevoMailer({
    apiKey,
    senderEmail,
    senderName: env['MAIL_FROM_NAME'] ?? 'CRM',
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function invitationText(url: string, from: string): string {
  return [
    `Ai fost invitat(ă) să îți creezi un cont în CRM-ul ${from}.`,
    '',
    `Deschide linkul de mai jos ca să îți alegi numele de utilizator și parola (valabil 7 zile):`,
    url,
    '',
    'Dacă nu așteptai acest email, îl poți ignora.',
  ].join('\n');
}

function invitationHtml(url: string, from: string): string {
  const safeUrl = escapeHtml(url);
  return `<p>Ai fost invitat(ă) să îți creezi un cont în CRM-ul ${escapeHtml(from)}.</p>
<p><a href="${safeUrl}">Creează contul</a> (linkul este valabil 7 zile).</p>
<p>Dacă nu așteptai acest email, îl poți ignora.</p>`;
}
