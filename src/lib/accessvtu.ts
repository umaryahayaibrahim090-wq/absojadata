import 'server-only';

const baseUrl = process.env.VTU_API_BASE_URL || 'https://accessvtu.com.ng/api';

/**
 * Server-side AccessVTU client. Never import this module into a client component.
 * The provider's PHP example uses `Authorization: Token <API_KEY>`.
 */
export async function checkAccessVtuAccount() {
  const apiKey = process.env.VTU_API_KEY;
  if (!apiKey) {
    throw new Error('AccessVTU is not configured: set VTU_API_KEY on the server.');
  }

  const url = new URL('/user', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  // Do not return or log provider response content; it may include account data.
  const contentType = response.headers.get('content-type') || '';
  let providerMessage: string | undefined;
  if (contentType.includes('application/json')) {
    try {
      const body = await response.json();
      if (typeof body?.message === 'string') providerMessage = body.message;
    } catch {
      // A malformed response is still reported using the HTTP status only.
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    message: response.ok ? 'AccessVTU connection successful.' : 'AccessVTU rejected the connection check.',
    ...(providerMessage && !response.ok ? { providerMessage } : {}),
  };
}
