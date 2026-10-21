import { BrevoMailer, createMailer, NoopMailer } from './mailer';

describe('mailer', () => {
  it('sends nothing without Brevo settings', async () => {
    const mailer = createMailer({});
    expect(mailer).toBeInstanceOf(NoopMailer);
    expect(await mailer.sendInvitation('a@example.com', 'https://x')).toBe(
      false,
    );
  });

  it('posts the invitation to Brevo with the API key header', async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fakeFetch = async (
      url: string | URL | Request,
      init?: RequestInit,
    ) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response('{}', { status: 201 });
    };
    const mailer = new BrevoMailer(
      {
        apiKey: 'test-key',
        senderEmail: 'no-reply@drana.ro',
        senderName: 'Dr. Ana',
      },
      fakeFetch as typeof fetch,
    );
    expect(
      await mailer.sendInvitation(
        'dr@example.com',
        'https://crm/accept#token=t',
      ),
    ).toBe(true);
    expect(calls[0].url).toBe('https://api.brevo.com/v3/smtp/email');
    expect((calls[0].init.headers as Record<string, string>)['api-key']).toBe(
      'test-key',
    );
    const payload = JSON.parse(String(calls[0].init.body));
    expect(payload.to).toEqual([{ email: 'dr@example.com' }]);
    expect(payload.textContent).toContain('https://crm/accept#token=t');
  });

  it('fails without exposing the response body', async () => {
    const mailer = new BrevoMailer(
      { apiKey: 'k', senderEmail: 'a@b.ro', senderName: 'X' },
      (async () =>
        new Response('dr@example.com rejected', {
          status: 400,
        })) as typeof fetch,
    );
    await expect(mailer.sendInvitation('dr@example.com', 'u')).rejects.toThrow(
      'brevo_send_failed_400',
    );
  });
});
