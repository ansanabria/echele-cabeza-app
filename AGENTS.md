# Agent Context for Colombia Elections App

This file gives future agents only the minimum context needed to keep moving.
If deeper implementation details are needed, load the relevant skill file instead of expanding this document.

## 1) Technical Context (High-Level)

### Stack Overview
- Frontend: Next.js (App Router) + React + TypeScript.
- CMS / Backend: Payload CMS (TypeScript-first) with local API and admin UI.
- Testing: Vitest (integration/unit) and Playwright (e2e).
- Tooling: ESLint, Docker support, generated Payload types in `src/payload-types.ts`.

### Project Shape
- Main app code lives in `src/app`.
- Payload config lives in `src/payload.config.ts`.
- Collections live in `src/collections`.
- Admin import map lives in `src/app/(payload)/admin/importMap.js`.

### Critical Rules (Do Not Skip)
1. When using Payload local API with a `user`, always set `overrideAccess: false`.
2. In Payload hooks, always pass `req` to nested Payload operations.
3. Prevent hook loops by using context flags when hooks trigger writes.
4. After schema/config changes, run type generation (`generate:types`).
5. After creating/updating admin components, regenerate import map (`payload generate:importmap`).
6. Validate TypeScript with `tsc --noEmit` after meaningful code changes.

### Agent Depth Rule
- Keep stack assumptions lightweight in normal execution.
- If implementation requires deeper framework-specific rules, load a skill:
  - `payload` skill for Payload schemas, access, hooks, transactions, and API behavior.
  - `frontend-design` skill for UI/UX design and component styling quality.
  - Other skills only when directly relevant.

---

## 2) Business Context (High-Level)

### Product Mission
Build a neutral, trustworthy, and easy-to-understand website for Colombia’s upcoming presidential election, so voters can review relevant candidate information in one place before voting.

### Audience & Language
- Primary audience: voters nationwide in Colombia.
- Language at launch: Spanish only.
- Writing style: very simple, approachable language (avoid technical/political jargon where possible).

### MVP Scope
- Election scope: presidential candidates only (major candidates).
- Core pages/features:
  - Candidate directory/list.
  - Candidate detail pages.
  - Side-by-side comparison.
  - Source citations per claim.
  - Public correction history.
- Public experience is open read-only (no public user accounts in MVP).

### Candidate Information Model (Required Coverage)
Each candidate profile should cover:
1. Biography / trajectory.
2. Government proposals.
3. Scandals / controversies.
4. Alliances / endorsements.
5. Voting or legislative record.
6. Assets, funding, and campaign finance.

### Editorial Policy
- Tone must be strictly descriptive and non-opinionated.
- Avoid rankings/scores in MVP to preserve neutrality.
- For sensitive claims (including scandals), show:
  - What is alleged/claimed.
  - Current status.
  - Outcome (if available).
  - Clear citations.
- Sourcing approach: editor discretion with citation notes, preferring source hierarchy:
  - Official documents/institutions.
  - Reputable media.
  - NGOs/civil society reports.
  - Social media (lowest trust, contextual only).

### Operations & Governance
- Content ingestion at launch: manual CMS entry.
- Editorial roles at launch: `admin`, `editor` (invitation-only).
- Workflow: draft -> review -> publish.
- Update cadence target during campaign peak: every 2–3 days.
- Include legal/editorial disclaimer in footer and About page.
- Use privacy-first analytics (no invasive personal tracking).

---

## 3) Agent Working Agreement

When requirements are ambiguous:
1. Default to the simplest implementation that supports voter understanding and neutrality.
2. Do not add scope beyond MVP without explicit instruction.
3. Ask clarifying questions before introducing new product assumptions.

When making code changes:
1. Make small, targeted edits.
2. Preserve existing architecture unless a change is explicitly requested.
3. Validate the changed surface area with relevant tests/checks.
