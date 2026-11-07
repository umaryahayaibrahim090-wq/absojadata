# ABSOJADATA

ABSOJADATA is a modern VTU vending platform for Nigerian mobile data and airtime purchases.

## Stack
- Next.js 14
- TypeScript
- Prisma ORM
- SQLite by default for local development
- JWT-based auth
- Role-based customer/admin access

## Features
- User registration and login
- Secure wallet funding and balance deduction
- Data purchase for MTN, Airtel, Glo, 9mobile
- Airtime recharge flows
- Admin dashboard and bundle management
- Provider-ready integration modules

## Setup
1. Install dependencies:
   npm install
2. Generate Prisma client:
   npx prisma generate
3. Push schema and seed database:
   npx prisma db push
   npm run db:seed
4. Start app:
   npm run dev

## Environment
Copy `.env.example` to `.env` and update the values.

## Admin account
The seed creates an admin user with:
- Email: admin@absojadata.com
- Password: Admin@123

## Notes
The app has a real server-side database and actual purchase logic. Live VTU/payment provider credentials should be added as secure environment variables only on the backend.
