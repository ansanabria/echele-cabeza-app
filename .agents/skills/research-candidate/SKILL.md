---
name: research-candidate
description: Research a Colombian presidential candidate from trusted sources and produce a neutral initial markdown profile in research/. Use this skill whenever a user asks to investigate a candidate, compile evidence, or draft a CMS-aligned research file.
---

# Candidate Research Drafting

Use this skill to produce a first-pass research file in `research/` that aligns with the site's candidate data model.

## Inputs

- Candidate name (required)
- Trusted sources list (required; URLs or documents)
- Optional date cut-off for "as of" framing

## Output

Create `research/<candidate-slug>.md` with:

1. Neutral, descriptive Spanish prose.
2. Explicit mapping to CMS fields (collection `Candidates`).
3. Clear sourcing for every sensitive claim.

Follow this structure:

1. Sidebar fields (`name`, `slug`, `party`, `currentOffice`, `lastUpdated`)
2. `socialLinks`
3. `biography`, `publicTrajectoryItems`, `privateTrajectoryItems`
4. `proposals`, `proposalItems`
5. `controversies`, `controversyItems`
6. `alliances`, `allianceParties`, `endorsers`
7. `record`
8. `funding`
9. Global `sources`
10. Comparison summaries (`summaryTrajectory`, `summaryProposals`, `summaryControversies`, `summaryAlliances`, `summaryRecord`, `summaryFunding`)

## Editorial method

1. Prioritize source hierarchy:
   - official institutions/documents
   - reputable Colombian media
   - NGOs/civil-society reports
   - social media only for direct candidate statements
2. Separate verified facts from allegations.
3. For controversies, always include:
   - what is alleged
   - current legal/political status
   - known outcome (if any)
4. When sources disagree, state ambiguity explicitly and present the competing versions without taking sides.
5. Do not score, rank, or infer intent.

## Writing constraints

- Keep tone factual and plain.
- Avoid loaded adjectives.
- Use concise paragraphs and traceable claims.
- Prefer explicit dates and institutions over vague phrasing.

## Field-level rules

- `lastUpdated` and `sources[].publishedAt`: `YYYY-MM-DD`.
- `socialLinks[].platform`: `x|instagram|facebook|youtube`.
- `proposalItems[].sourceTier`, `controversyItems[].sourceTier`, `sources[].tier`: `oficial|prensa|ong|redes`.
- `controversyItems[].status`: `suspicion|under_investigation|indicted|cleared|convicted`.
- `sources[].section`: `biography|proposals|controversies|alliances|record|funding`.

## Missing-information policy

If evidence is unavailable:

- keep the section present,
- state that information is not publicly confirmed as of the cut-off date,
- cite what was checked.

Never fabricate fillers.
