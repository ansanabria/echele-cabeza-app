# Agent Context — Colombia Elections App

This file is the single source of context for any agent working on this project. It is intentionally brief. Read it top to bottom before starting any task. If a section points you to a skill, load that skill file before going deeper.

---

## Tech Stack

The app is a **Next.js** (App Router) frontend backed by **Payload CMS** as both the content API and admin UI. Everything is written in **TypeScript**.

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + React + TypeScript |
| CMS / API | Payload CMS — local API + admin UI |
| Testing | Vitest (unit/integration) · Playwright (e2e) |
| Tooling | ESLint · Docker · generated types at `src/payload-types.ts` |

**Where things live:**

- `src/app` — all Next.js routes (frontend under `(frontend)/`, Payload admin under `(payload)/`)
- `src/payload.config.ts` — Payload configuration
- `src/collections` — collection definitions
- `src/app/(payload)/admin/importMap.js` — admin import map (regenerate after adding admin components)

### Non-Negotiable Rules

Breaking any of these will cause security holes, data corruption, or type errors. Do not skip them.

1. **Always set `overrideAccess: false`** when calling the Payload local API with a `user` object.
2. **Always pass `req`** to nested Payload operations inside hooks to keep them in the same transaction.
3. **Prevent hook loops** by guarding recursive writes with a context flag (e.g. `context.skipHooks`).
4. **Regenerate types** after any schema or config change — run `generate:types`.
5. **Regenerate the import map** after adding or editing admin components — run `payload generate:importmap`.
6. **Validate TypeScript** after meaningful changes — run `bunx tsc --noEmit`.
7. **Always use Bun tooling** for project commands (for example: `bun run <script>` and `bunx <cli>`). Do not use `npm`, `npx`, `pnpm`, or `yarn` in this repo unless explicitly requested.

### When to Load a Skill

This file stays thin on purpose. If a task requires deeper knowledge, load the matching skill:

- Payload schemas, access control, hooks, queries, or transactions → load the **`payload`** skill.
- UI components, page layouts, or visual design → load the **`frontend-design`** skill **and** the design system at `.agents/skills/frontend-design/DESIGN_SYSTEM.md`.
- Only load other skills when they are directly relevant to the task at hand.

---

## Design Conventions (Summary)

The full design system lives at `.agents/skills/frontend-design/DESIGN_SYSTEM.md`. **Load it before doing any frontend work.** Below is the condensed version for quick reference.

**Aesthetic:** Warm editorial minimalism — think magazine, not SaaS dashboard. Inspired by Anthropic's homepage with a Colombian civic-green accent.

**Colors:** Defined as Shadcn theme tokens in `src/app/(frontend)/styles.css`. Light and dark themes are both available. Always use Tailwind theme classes (`bg-background`, `text-primary`, `border-border`, etc.) — never hardcode color values.

| Token | Role |
|---|---|
| `--background` | Warm off-white page body |
| `--foreground` | Primary body text |
| `--primary` | Strong green — links, buttons, focus rings |
| `--card` | Elevated panel surfaces |
| `--muted-foreground` | De-emphasized text (dates, labels) |
| `--border` | Thin warm borders |

**Typography:**

| Role | Font | Tailwind class |
|---|---|---|
| Display / headings (h1, h2) | `Instrument Serif` | `font-serif` (auto via base layer) |
| Body / UI / everything else | `DM Sans` | `font-sans` (default) |

Both are loaded from Google Fonts in the frontend layout. `h1` and `h2` automatically get `font-serif` via the CSS base layer — no manual class needed.

**Key rules:**
- **All component styling is Tailwind utility classes only.** `styles.css` only defines the Shadcn theme — no custom CSS classes for components.
- No hardcoded colors — always use theme tokens.
- Candidate cards must be uniform — no visual favoritism.
- Labels/tags: `text-xs font-medium tracking-widest uppercase text-muted-foreground`.
- Spacing is generous; max content width is `max-w-7xl mx-auto` (set in layout).
- Use Shadcn components styled via the theme tokens.

---

## What We're Building

Colombia's next presidential election is approaching, and there is no single reliable place online where voters can find clear, unbiased information about every major candidate. This app fills that gap.

The goal is simple: give any Colombian voter a single place to read — in plain Spanish — what each major presidential candidate stands for, what their record looks like, and what controversies surround them, all backed by verifiable sources.

### Who it's for

All voters nationwide. The writing style must be simple and approachable — think of a voter who doesn't follow politics closely and needs the key facts explained without jargon.

### What the MVP covers

The first release focuses on major presidential candidates only. Every visitor can:

- Browse the full candidate directory.
- Read a candidate detail page.
- Compare two candidates side by side.
- See the sources behind each claim.
- View the public correction history for any candidate.

There are no user accounts. The public experience is entirely read-only.

### What goes on each candidate page

Every profile must include all six sections below — no exceptions:

1. **Biography / trajectory** — key life events and public offices held.
2. **Government plan / proposals** — concrete policy positions.
3. **Scandals / controversies** — allegations, current status, and outcome if known.
4. **Alliances and endorsements** — who is backing them.
5. **Voting / legislative record** — how they have acted in office.
6. **Assets, funding, and campaign finance** — declared wealth and donors.

### Editorial rules

- **Tone is strictly descriptive.** No opinions, no framing language, no implicit rankings.
- **No scoring or ranking of candidates** in the MVP — this preserves neutrality.
- **All sensitive claims** (especially scandals) must state: what is alleged, the current legal/political status, and the outcome if one exists. Every such claim needs a citation.
- **Source hierarchy** (prefer higher tiers): official documents and institutions → reputable Colombian media (e.g. La Silla Vacía, Revista Cambio) → NGOs and civil society reports → social media (lowest trust, use only for direct candidate statements with full context).
- **Content workflow:** draft → review → publish. Editors target an update cycle of every 2–3 days during campaign peak.
- **Access is invitation-only.** Only `admin` and `editor` roles exist; no self-signup.

### Legal and privacy

- A neutrality and editorial disclaimer must appear in both the footer and the About page.
- Analytics must be privacy-first — no invasive personal tracking.

---

## Working Agreement

Follow these defaults on every task:

- **Stay in scope.** Do not build beyond MVP features without an explicit instruction to do so.
- **When in doubt, ask.** If a requirement is ambiguous, ask one focused clarifying question before proceeding.
- **Make small, targeted edits.** Avoid large refactors unless explicitly requested.
- **Keep the architecture stable.** Preserve existing patterns unless a change is directly requested.
- **Verify your work.** After any non-trivial change, validate the affected surface area with the relevant tests or type checks.

---

## Cursor Cloud specific instructions

### System prerequisites

The VM update script installs Bun and PostgreSQL automatically. After it runs, the following are available:

- **Bun** (`~/.bun/bin/bun`) — add `$HOME/.bun/bin` to `PATH` if not already present.
- **PostgreSQL 16** on `127.0.0.1:5432` — must be started with `sudo pg_ctlcluster 16 main start` before running the app or tests.
- **Node.js 22** — pre-installed via nvm.

### Database setup (one-time, already done in snapshot)

A local database `col_elections` exists with user `postgres` / password `postgres`. The `.env` file points to it:

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/col_elections
PAYLOAD_SECRET=dev-secret-key-for-local-development-only-32chars
```

If the `.env` file is missing, recreate it with the values above.

### Starting the dev server

```bash
sudo pg_ctlcluster 16 main start   # ensure Postgres is running
bun dev                              # starts Next.js + Payload on http://localhost:3000
```

The frontend is at `/`, the Payload admin UI is at `/admin`.

### Running checks

All standard commands are in `package.json` scripts. See the README "Useful Commands" table. Key ones:

- `bun run lint` — ESLint (exits 0 with warnings only)
- `bun run test:int` — Vitest integration tests (needs Postgres running)
- `bunx tsc --noEmit` — TypeScript validation
- `bun run test:e2e` — Playwright e2e (install Chromium first: `bunx playwright install --with-deps chromium`)

### Seeding data

Run `bun run seed` to populate the database with 26 candidates from `data/candidates.md`. Photos will use a 1px placeholder since the `media/` directory with real images is not committed.

### Gotchas

- The `docker-compose.yml` is a leftover from the Payload template (references MongoDB). Ignore it — this project uses PostgreSQL exclusively.
- The `.env.example` shows a MongoDB URL — also a template leftover. Always use a PostgreSQL connection string.
- Candidate photo warnings during seed are expected when the `media/` image files are absent; placeholders are used instead.
