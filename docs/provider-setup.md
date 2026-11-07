## AccessVTU account connectivity check

The provider supplied a PHP example for `GET https://accessvtu.com.ng/api/user` using the `Authorization: Token <API_KEY>` header. ABSOJADATA implements that request server-side in `src/lib/accessvtu.ts`.

Set `VTU_API_BASE_URL=https://accessvtu.com.ng/api` and `VTU_API_KEY` in the server's environment. Never add the actual key to source control or a `NEXT_PUBLIC_*` variable. An authenticated administrator can test connectivity with `POST /api/admin/providers/accessvtu/test`; it returns only connection status and does not expose the provider's account response or API key.

This endpoint verifies credentials/account access only. It does not yet identify catalogue, airtime, data purchase, or transaction-verification endpoints. Those require the corresponding AccessVTU documentation before live vending can safely be enabled. Paystack also requires a server-side secret key and signed webhook/verification flow before wallet deposits are real.
