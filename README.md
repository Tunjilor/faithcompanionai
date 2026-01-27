// initial production deploy

# Faith Companion AI

Faith Companion AI is a Next.js + Prisma application providing Bible-based quizzes, scripture guidance, and premium faith tools.

---

## Tech Stack

- Next.js 14 (App Router)
- Prisma ORM
- SQLite (local development)
- PostgreSQL (production – Vercel / Neon)
- Stripe (subscriptions)
- TypeScript

---

# 🚀 DAILY DEVELOPMENT WORKFLOW (DEV)

### Terminal A (Next.js App)
```bash
cd C:\dev\faithcompanionai
npm run dev
App runs at: http://localhost:3000

Terminal B (Database / Admin)
cd C:\dev\faithcompanionai
npm run studio
Prisma Studio: http://localhost:5555

One-time (or when DB changes)
npm run seed
Seeds quiz questions into local SQLite database

🧠 ADMIN SCRIPTS (LOCAL OR PROD)
Admin scripts are never exposed to users.

npm run admin:count-questions
npm run admin:make-premium -- user@example.com 30
npm run admin:revoke-premium -- user@example.com
npm run admin:reset-attempts -- user@example.com
🔐 ENVIRONMENT SETUP
Local (.env.local)
DATABASE_URL="file:./prisma/dev.db"

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
STRIPE_PRICE_LIFETIME=price_...

SESSION_SECRET=some-long-random-string
Production (Vercel)
DATABASE_URL → PostgreSQL (Neon)

NEVER use file: in production

All Stripe + SESSION_SECRET required

🧪 PRE-DEPLOY CHECKLIST (RUN BEFORE PUSH)
npm run predeploy
This runs:

ESLint

TypeScript checks

Prisma validation

Production build

✅ If this passes, deployment is safe.

🚢 PRODUCTION DEPLOYMENT (VERCEL)
Push to main

Vercel auto-builds and deploys

Verify production env variables

Confirm database is PostgreSQL

🔄 ROLLBACK PLAN (IMPORTANT)
If production breaks:

Go to Vercel → Project → Deployments

Find last known good deployment

Click ⋯ → Promote to Production

Rollback is instant.

⚠️ Never rollback if the newer deploy ran incompatible DB migrations.

🔒 PRODUCTION SAFETY RULES
SQLite never allowed in production

Admin routes require secret token

Premium logic enforced server-side

Free users rate-limited daily

🧭 TROUBLESHOOTING RULES
If something feels “off”:

Stop (Ctrl+C) and restart npm run dev

Confirm correct port (3000 vs 3001)

Confirm DATABASE_URL

Check Prisma Studio for data

Re-run npm run seed if needed

✅ STATUS
Local dev: ✅ stable

Seeding: ✅ stable

API routes: ✅ working

Premium logic: ✅ enforced

Ready for production when PostgreSQL is connected

🙏 Built with intention and care.


---





