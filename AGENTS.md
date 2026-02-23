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
6. **Validate TypeScript** after meaningful changes — run `tsc --noEmit`.

### When to Load a Skill

This file stays thin on purpose. If a task requires deeper knowledge, load the matching skill:

- Payload schemas, access control, hooks, queries, or transactions → load the **`payload`** skill.
- UI components, page layouts, or visual design → load the **`frontend-design`** skill.
- Only load other skills when they are directly relevant to the task at hand.

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
