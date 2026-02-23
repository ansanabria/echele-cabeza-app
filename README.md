# Colombia Elections App

A neutral, voter-focused website that gives Colombians a single place to read clear, unbiased information about every major presidential candidate — backed by verifiable sources.

## Why this exists

There is no single reliable resource online where Colombian voters can find thorough, up-to-date, and unbiased profiles of presidential candidates. This project fills that gap by publishing structured, sourced candidate information in plain Spanish, covering everything from policy proposals to controversies.

## What it does

Visitors can:

- Browse a directory of major presidential candidates.
- Read a full candidate profile (biography, proposals, scandals, endorsements, legislative record, and campaign finance).
- Compare two candidates side by side.
- See the sources behind every claim.
- View the public correction history for any candidate.

There are no user accounts. The public-facing site is entirely read-only.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + React + TypeScript |
| CMS / API | Payload CMS — local API + admin UI |
| Database | Neon Postgres (via Postgres adapter) |
| Testing | Vitest (unit/integration) · Playwright (e2e) |
| Runtime / PM | Bun · ESLint · Docker |

## Project Structure

```
src/
├── app/
│   ├── (frontend)/        # Public-facing Next.js routes
│   └── (payload)/         # Payload admin UI routes
├── collections/           # Payload collection definitions
├── payload.config.ts      # Payload configuration
└── payload-types.ts       # Auto-generated TypeScript types (do not edit)
tests/
├── e2e/                   # Playwright end-to-end tests
├── int/                   # Vitest integration tests
└── helpers/               # Shared test utilities
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.1+
- A [Neon](https://neon.tech) Postgres database (free tier works for development)

### Local Development

```bash
# 1. Clone the repo
git clone <repo-url>
cd col-elections-app

# 2. Copy environment variables and fill in your values
#    Set DATABASE_URL to your Neon connection string
cp .env.example .env

# 3. Install dependencies
bun install

# 4. Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (`postgresql://user:pass@host/dbname?sslmode=require`) |
| `PAYLOAD_SECRET` | Random secret used to sign Payload sessions |

### Docker (optional)

The `docker-compose.yml` can spin up a local Postgres instance if you prefer not to use Neon during development:

```bash
# Set DATABASE_URL in .env to: postgresql://postgres:postgres@127.0.0.1:5432/col-elections
docker-compose up -d
bun dev
```

### Useful Commands

| Command | Description |
|---|---|
| `bun dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run generate:types` | Regenerate Payload TypeScript types after schema changes |
| `bun run generate:importmap` | Regenerate admin import map after adding admin components |
| `bun run test:int` | Run Vitest unit/integration tests |
| `bun run test:e2e` | Run Playwright end-to-end tests |
| `bunx tsc --noEmit` | Validate TypeScript without emitting files |

## Content & Editorial

All candidate data is entered manually by invitation-only editors through the Payload admin UI. The editorial workflow is **draft → review → publish**.

Content rules:
- Tone is strictly descriptive — no opinions or candidate rankings.
- Every sensitive claim (especially scandals) must include: what is alleged, current status, and outcome if known, with a citation.
- Preferred sources: official institutions → reputable Colombian media (La Silla Vacía, Revista Cambio) → NGOs → social media (last resort).

## Contributing

Access to the CMS is invitation-only. If you are a developer contributing to the codebase, please read [AGENTS.md](./AGENTS.md) for project conventions and architecture rules before making changes.

## License

MIT — see [LICENSE](./LICENSE) for details.
