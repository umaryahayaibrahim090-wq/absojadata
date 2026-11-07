# ABSOJADATA

ABSOJADATA is a modern VTU vending platform for Nigerian mobile data and airtime purchases.

## Tech stack
- Next.js 14
- TypeScript
- Prisma ORM
- SQLite (for local dev)
- JWT auth
- Role-based customer/admin access

## Setup
1. npm install
2. npx prisma generate
3. npx prisma db push
4. npm run db:seed
5. npm run dev

## Environment
Copy `.env.example` then set your secure values.

## Default admin account
- Email: admin@absojadata.com
- Password: Admin@123

## Notes
This starter implements a working local VTU platform with real server-side wallet logic and provider-ready APIs. Production providers and secrets should be configured only in server-side environment variables.
