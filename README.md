# Opportunity Radar

Opportunity Radar is a production-oriented SaaS-style web application for discovering keywords that are worth turning into apps, websites, or SaaS products. It ships with authenticated dashboards, a Prisma/PostgreSQL data model, modular ingestion services, a transparent scoring engine, and structured product recommendations.

## What is included

- **Next.js 15 App Router** application written in TypeScript.
- **Auth.js (NextAuth)** credentials-based email login with protected routes.
- **Prisma ORM** schema designed for PostgreSQL deployments on Supabase, Neon, Railway, or any compatible managed Postgres provider.
- **Modular ingestion pipeline** with collector abstractions for Google Trends-style data, Reddit, and Product Hunt-style discovery feeds.
- **Normalization, clustering, scoring, and recommendation services** isolated in reusable modules.
- **Seeded data** so the app is usable locally immediately after setup.
- **Dashboard, explorer, detail, alerts, and settings pages** with responsive SaaS-style UI.

## Core architecture

```text
app/
  (auth)/login           Auth entry point
  (app)/dashboard        Protected dashboard
  (app)/keywords         Explorer + keyword details
  (app)/alerts           Alerts/reporting surface
  (app)/settings         Workspace + scoring config
  api/auth               Auth.js handlers
  api/ingest/mock        Mock ingestion trigger
components/
  auth/                  Login/logout UI
  dashboard/             KPI cards, charts, lists
  keywords/              Explorer and detail views
  layout/                Sidebar and top header
  ui/                    Reusable UI primitives
lib/
  auth/                  Auth config + actions
  data/                  Query layer for pages
  services/              Ingestion, normalization, scoring, recommendation engines
  utils/                 Shared helpers
prisma/
  schema.prisma          PostgreSQL data model
  seed.ts                Demo seed data
  migrations/            Initial SQL migration
```

## Data model highlights

The Prisma schema includes the following production-friendly models:

- `User`
- `Keyword`
- `KeywordVariant`
- `KeywordMetric`
- `KeywordSourceEvent`
- `KeywordCluster`
- `ProductRecommendation`
- `Alert`
- `SavedKeyword`
- `IngestionRun`
- Auth.js support tables: `Account`, `Session`, `VerificationToken`

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and update values if needed.

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string.
- `NEXTAUTH_URL`: your local or deployed application URL.
- `AUTH_SECRET`: long random secret for Auth.js session encryption.
- `DEMO_USER_EMAIL`: seeded login email.
- `DEMO_USER_PASSWORD`: seeded login password.

### 3. Start PostgreSQL

Use any PostgreSQL instance. Example Docker command:

```bash
docker run --name opportunity-radar-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=opportunity_radar \
  -p 5432:5432 \
  -d postgres:16
```

### 4. Generate the Prisma client

```bash
npm run db:generate
```

### 5. Apply the database schema

```bash
npm run db:migrate
```

### 6. Seed the database

```bash
npm run db:seed
```

This creates a demo founder account plus sample keyword opportunities, metrics, recommendations, alerts, saved items, and ingestion runs.

### 7. Run the app

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with the seeded credentials from your `.env` file.

## Demo login

By default, the seed script expects:

- Email: `founder@opportunityradar.dev`
- Password: `ChangeMe123!`

## Ingestion pipeline design

The ingestion layer lives in `lib/services/ingestion.ts` and is designed for cron-friendly execution.

### Current MVP behavior

- `GoogleTrendsMockCollector`
- `RedditMockCollector`
- `ProductHuntMockCollector`

These mock collectors return normalized keyword records that then flow through:

1. normalization
2. canonicalization
3. deduplication
4. clustering
5. scoring
6. product recommendation generation

### Swapping in real providers later

Each source follows the `KeywordCollector` interface:

```ts
interface KeywordCollector {
  platform: SourcePlatform;
  collect(): Promise<CollectorResult>;
}
```

That means production integrations can replace the mocks without changing the higher-level pipeline.

## Scoring engine

The scoring engine is intentionally transparent and centralized in `lib/services/scoring.ts`.

Scores generated for each keyword:

- trend score
- demand score
- competition score
- monetization score
- overall opportunity score

This keeps the logic inspectable and easy to tune as real-world signal data improves.

## Deployment notes

### Vercel

1. Create a new Vercel project from this repository.
2. Set the environment variables from `.env.example`.
3. Point `DATABASE_URL` to a managed Postgres instance.
4. Run Prisma migrations during deployment or in CI/CD.

### PostgreSQL providers

Good MVP deployment targets:

- Supabase
- Neon
- Railway
- Render PostgreSQL

### Recommended production checklist

- Replace demo credentials with a user onboarding flow.
- Add magic-link email provider if preferred over credentials login.
- Add background scheduling for ingestion jobs.
- Add rate limiting and audit logging to write APIs.
- Add observability (Sentry, logs, uptime checks).
- Add row-level authorization if multi-team workspaces are introduced.

## Available pages

- `/login`
- `/dashboard`
- `/keywords`
- `/keywords/[slug]`
- `/alerts`
- `/settings`

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

## Notes

- The app is intentionally seeded so it is immediately inspectable.
- The architecture favors maintainability over fake complexity.
- Mock ingestion is included today; real adapters can be plugged in later without refactoring the core domain flow.
