import { ApiError, apiRequest } from './api-client';

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiRequest', () => {
  it('returns the data field and sends JSON on the same origin', async () => {
    const fetchMock = mockFetch(200, { data: { id: 'u1' } });

    await expect(
      apiRequest('/auth/login', { method: 'POST', body: { username: 'a' } }),
    ).resolves.toEqual({ id: 'u1' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/auth/login');
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'same-origin',
      body: '{"username":"a"}',
    });
  });

  it('throws the server error code', async () => {
    mockFetch(401, { error: { code: 'invalid_credentials', message: 'x' } });

    await expect(apiRequest('/auth/login')).rejects.toMatchObject({
      status: 401,
      code: 'invalid_credentials',
    });
  });

  it('reports a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

    const error = await apiRequest('/users').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'network' });
  });

  it('accepts an empty 204 response', async () => {
    mockFetch(204, undefined);
    await expect(
      apiRequest('/auth/logout', { method: 'POST' }),
    ).resolves.toBeUndefined();
  });
});
