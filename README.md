# Rula — Healthcare Providers Directory

A fullstack provider directory built with **Next.js 16 (App Router)**, **PostgreSQL**, and **Drizzle ORM**.

## Features

- **Home** — hero search (state + care type), insurance marquee, 3-step onboarding, featured providers, `$15` cost band, network stats, FAQ.
- **`/providers`** — filterable directory: search, care type, state, specialty, insurance, gender, language, age; sorting, active filter chips, mobile filter drawer, loading / empty / error states.
- **`/providers/[slug]`** — provider profile with reviews, rating distribution, insurance accepted, and a working appointment request form.
- **API** — `GET /api/providers` (search), `POST /api/inquiries` (persists to Postgres), `GET /api/health`.

## Stack

| Layer      | Tech                                   |
| ---------- | -------------------------------------- |
| Framework  | Next.js 16, React 19, TypeScript       |
| Styling    | Tailwind CSS v4                        |
| Database   | PostgreSQL + Drizzle ORM               |
| Fonts      | Figtree + Inter (Google Fonts)         |

## Local setup

```bash
npm install

# 1. Configure the database (Postgres must be running)
echo "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db" > .env

# 2. Create the tables
npx drizzle-kit push

# 3. Seed 24 providers + 72 reviews
npx tsx src/db/seed.ts

# 4. Run
npm run dev
```

Open http://localhost:3000.

## Deploy

The app runs on any Node host. For Vercel:

1. Push to GitHub (see below), then import the repo in Vercel.
2. Add a hosted Postgres URL (Neon, Supabase, RDS) as the `DATABASE_URL` environment variable.
3. Build command stays `next build`; run `npx drizzle-kit push && npx tsx src/db/seed.ts` once against the hosted database.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Rula provider directory"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Notes

- Headshots are cropped from `public/images/sheet-*.png` contact sheets using CSS `background-position`.
- `.env` and `node_modules/` are gitignored — never commit database credentials.
- This is a demo directory; provider profiles are seeded sample data, not real clinicians.
