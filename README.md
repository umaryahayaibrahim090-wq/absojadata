# ABSOJADATA

ABSOJADATA is a Nigerian VTU platform project using Next.js, TypeScript, Prisma, and PostgreSQL configuration. It includes initial customer/admin UI and an AccessVTU server-side account connectivity check.

## Setup
1. Install Node.js and dependencies: `npm install`
2. Copy `.env.example` to `.env` and set local PostgreSQL connection details and a long random `JWT_SECRET`.
3. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` in your local server environment.
4. Generate the Prisma client and apply the schema: `npx prisma generate` and `npx prisma db push`.
5. Run the app: `npm run dev`.

## Provider secrets
Set `VTU_API_SECRET`, `PAYMENT_GATEWAY_SECRET_KEY`, and other credentials using local environment variables or your deployment provider's secret manager. Never commit actual secrets, share them in chat, or expose them through `NEXT_PUBLIC_*` variables. See `docs/provider-setup.md`.

## Live service status
The supplied AccessVTU snippet documents account lookup only. Product catalog, data/airtime purchase, transaction verification, and Paystack payment/webhook flows still require the providers' full API documentation and implementation/testing. Do not treat sample plan prices or mock flows as live or verified pricing.
