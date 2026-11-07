## Provider configuration

The supplied AccessVTU example confirms the account-check endpoint `GET https://accessvtu.com.ng/api/user` and the `Authorization: Token <API_KEY>` header. The server-side connectivity test reads the credential from `VTU_API_SECRET`; set it only in the deployment platform's secret/environment settings. An authenticated administrator can call `POST /api/admin/providers/accessvtu/test` to test connectivity.

Paystack uses `PAYMENT_GATEWAY_BASE_URL=https://api.paystack.co` and a server-only `PAYMENT_GATEWAY_SECRET_KEY`. The public key, if used by the browser payment component, is `PAYMENT_GATEWAY_PUBLIC_KEY`. Never use the secret key in client-side code or a `NEXT_PUBLIC_*` variable. Configure webhook verification with `PAYMENT_GATEWAY_WEBHOOK_SECRET` when implementing the webhook.

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are server-side deployment variables for provisioning an administrator; do not commit their actual values. `.env.example` contains blank placeholders only.

The account-check endpoint verifies AccessVTU authentication only; it does not reveal the data catalog or confirm data/airtime purchase and status-check API formats. Obtain those API instructions from AccessVTU before enabling live vending. Payment initialization, server-side verification, idempotent wallet crediting, and verified webhooks must likewise be implemented before accepting real wallet deposits.
