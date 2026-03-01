---
name: research-to-json
description: Transform candidate research markdown files from research/ into deterministic per-candidate JSON files in data/. Use this skill whenever a user asks to convert, structure, normalize, or prepare candidate research for seeding/Payload ingestion.
---

# Research Markdown -> Candidate JSON

Use this skill to convert `research/*.md` files into structured candidate JSON files for seeding.

## Goal

Produce **one JSON file per candidate** in `data/`:

- `research/ivan-cepeda.md` -> `data/ivan-cepeda.json`
- `research/abelardo-de-la-espriella.md` -> `data/abelardo-de-la-espriella.json`

Do not generate one big multi-candidate JSON document.

## Output contract

Write a JSON object that maps directly to the `Candidates` collection fields:

```json
{
  "name": "string",
  "slug": "string",
  "party": "string",
  "currentOffice": "string",
  "lastUpdated": "YYYY-MM-DD",
  "socialLinks": [
    { "platform": "x|instagram|facebook|youtube", "url": "https://..." }
  ],
  "biography": "string",
  "publicTrajectoryItems": [
    {
      "role": "string",
      "organization": "string",
      "startYear": "string",
      "endYear": "string",
      "location": "string",
      "description": "string"
    }
  ],
  "privateTrajectoryItems": [
    {
      "role": "string",
      "organization": "string",
      "startYear": "string",
      "endYear": "string",
      "location": "string",
      "description": "string"
    }
  ],
  "proposals": "string",
  "proposalItems": [
    {
      "title": "string",
      "description": "string",
      "topic": "string",
      "sourceTitle": "string",
      "sourceUrl": "https://...",
      "sourceTier": "oficial|prensa|ong|redes"
    }
  ],
  "controversies": "string",
  "controversyItems": [
    {
      "title": "string",
      "description": "string",
      "status": "suspicion|under_investigation|indicted|cleared|convicted",
      "year": "string",
      "sourceTitle": "string",
      "sourceUrl": "https://...",
      "sourceTier": "oficial|prensa|ong|redes"
    }
  ],
  "alliances": "string",
  "allianceParties": [{ "name": "string" }],
  "endorsers": [{ "name": "string" }],
  "record": "string",
  "funding": "string",
  "sources": [
    {
      "section": "biography|proposals|controversies|alliances|record|funding",
      "title": "string",
      "publishedAt": "YYYY-MM-DD",
      "url": "https://...",
      "tier": "oficial|prensa|ong|redes"
    }
  ],
  "summaryTrajectory": "string",
  "summaryProposals": "string",
  "summaryControversies": "string",
  "summaryAlliances": "string",
  "summaryRecord": "string",
  "summaryFunding": "string"
}
```

## Mapping rules

1. Read the research markdown headings and map by explicit CMS field names in backticks.
2. Parse code-block list items (`1.`, `2.`, etc.) into arrays preserving order.
3. Keep wording faithful to the research file; do not invent or embellish.
4. Normalize keys to exact field names from the contract above.
5. For optional arrays with no entries, use `[]`.
6. Keep dates in `YYYY-MM-DD` where present.
7. Preserve Spanish text exactly (except minimal cleanup for broken whitespace).
8. Exclude operational notes (e.g., "subir manualmente") from JSON values.

## Quality checks before writing

- `slug` must match output filename.
- `socialLinks[].platform` must be one of: `x`, `instagram`, `facebook`, `youtube`.
- `sourceTier` and `sources[].tier` must be one of: `oficial`, `prensa`, `ong`, `redes`.
- `controversyItems[].status` must be one of:
  `suspicion`, `under_investigation`, `indicted`, `cleared`, `convicted`.
- `sources[].section` must be one of:
  `biography`, `proposals`, `controversies`, `alliances`, `record`, `funding`.

## Behavior expectations

- If a field is truly missing in research markdown, leave it as an empty string or empty array (whichever matches type) and mention it in your final note.
- Never insert opinions, rankings, or sentiment language.
- Keep output deterministic so future runs over the same markdown produce the same JSON shape.
