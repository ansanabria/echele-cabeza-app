# Design System — Colombia Elections App

This document is the canonical reference for the visual language of the Colombia Elections App. Every agent building frontend UI must follow these conventions. The system is inspired by Anthropic's editorial aesthetic: warm, confident, typographically rich, and clean — adapted with a strong green accent that evokes civic trust and Colombian identity.

---

## 1. Design Philosophy

**Warm editorial minimalism.** The app should feel like a well-designed magazine, not a SaaS dashboard. Key principles:

- **Warmth over coldness.** Use warm off-white backgrounds, not sterile pure-white or dark-mode-by-default.
- **Typography is the hero.** Large, bold headings with generous line-height drive the hierarchy. Let type do the heavy lifting; avoid relying on color or iconography for structure.
- **Restraint over decoration.** Whitespace is a feature. Resist the urge to fill every pixel. One strong accent color (green) used sparingly is better than many colors used everywhere.
- **Confidence through simplicity.** Components should feel solid and deliberate. No gratuitous gradients, no shadows unless structurally needed, no rounded-everything.
- **Neutrality through design.** The design must never visually favor one candidate over another. Uniform card sizes, identical section layouts, no candidate-specific color coding.

---

## 2. Color Palette

All colors are defined as Shadcn theme tokens in `src/app/(frontend)/styles.css`. Use only Tailwind theme classes (e.g. `bg-background`, `text-primary`, `border-border`); do not introduce ad-hoc color values.

### Light Theme (default)

| Token | Tailwind class | Role |
|---|---|---|
| `--background` | `bg-background` | Page body — warm off-white |
| `--foreground` | `text-foreground` | Primary body text |
| `--card` | `bg-card` | Card/panel surfaces |
| `--card-foreground` | `text-card-foreground` | Text on cards |
| `--primary` | `bg-primary` / `text-primary` | Strong green — CTAs, active states, links |
| `--primary-foreground` | `text-primary-foreground` | Text on green backgrounds |
| `--secondary` | `bg-secondary` | Subtle warm surface for secondary areas |
| `--secondary-foreground` | `text-secondary-foreground` | Text on secondary surfaces |
| `--muted` | `bg-muted` | Muted backgrounds (tags, badges) |
| `--muted-foreground` | `text-muted-foreground` | De-emphasized text (dates, labels, metadata) |
| `--accent` | `bg-accent` | Hover/active state surfaces |
| `--accent-foreground` | `text-accent-foreground` | Text on accent surfaces |
| `--destructive` | `bg-destructive` | Errors, warnings |
| `--border` | `border-border` | Subtle warm borders |
| `--input` | `border-input` | Input field borders |
| `--ring` | `ring-ring` | Focus rings |

### Dark Theme

A full dark mode is defined in the theme. It is not used on the public site in MVP but is available for future use and for the Payload admin.

### Semantic color rules

- **Green (`--primary`)** is used only for: interactive elements (links, buttons), active/selected states, and focus indicators. Never use it for large background areas on the main site.
- **Text** always uses `text-foreground` or `text-muted-foreground`. Never use hardcoded hex or `text-black` / `text-white`.
- **Backgrounds** alternate between `bg-background` (page-level) and `bg-card` (elevated panels). The difference is subtle and intentional.
- **Borders** are thin (1px) and use `border-border`. Prefer whitespace or hairline rules over heavy borders or box-shadows.

---

## 3. Typography

### Font stack

| Role | Font | Tailwind class | Weight(s) |
|---|---|---|---|
| **Display / headings** | `Instrument Serif` | `font-serif` | 400 (regular) |
| **Body / UI** | `DM Sans` | `font-sans` | 400, 500, 700 |

Both are loaded from Google Fonts in the frontend layout. `font-sans` is the default body font (set in `@layer base`). Headings (`h1`, `h2`) automatically use `font-serif` via the base layer.

### Type scale

Use Tailwind's built-in sizes. Preferred mappings:

| Element | Tailwind classes | Font |
|---|---|---|
| Page title (h1) | `text-3xl` or `text-5xl` | Instrument Serif (auto via base) |
| Section heading (h2) | `text-xl` or `text-3xl` | Instrument Serif (auto via base) |
| Card title (h3) | `text-lg font-bold font-sans` | DM Sans |
| Body text | `text-base` | DM Sans (default) |
| Small / metadata | `text-sm` | DM Sans |
| Category label | `text-xs font-medium uppercase tracking-widest text-muted-foreground` | DM Sans |

### Typography rules

- **Headings are serif.** All `h1` and `h2` elements use `Instrument Serif` automatically via the CSS base layer. No need to add `font-serif` manually.
- **Everything else is sans-serif.** Body copy, labels, buttons, navigation — all `DM Sans` (the default `font-sans`).
- **Category labels** are uppercase `text-xs font-medium tracking-widest text-muted-foreground`.
- **Line heights** are generous: headings at `leading-tight` (1.25), body at `leading-relaxed` (1.625).
- **Never use font-size below `text-xs`** for accessibility.

---

## 4. Spacing & Layout

### Grid

- Max content width: `max-w-7xl` (80rem / 1280px), centered with `mx-auto`.
- Horizontal page padding: `px-6` on mobile, `px-8` on `md:`, `px-12` on `lg:`.
- Section vertical spacing: `py-16` or `space-y-12` between major sections.

### Spacing philosophy

- **Generous whitespace.** When in doubt, add more space, not less.
- **Consistent rhythm.** Use Tailwind's spacing scale (`4`, `6`, `8`, `12`, `16`). Avoid arbitrary values.
- **Asymmetric layouts are welcome** for editorial feel — e.g., a 1/3 + 2/3 split, or a narrow sidebar with a wide content area.

---

## 5. Components & Patterns

All styling is done via Tailwind utility classes directly on components. There is **no custom CSS** for individual components — `styles.css` only defines the Shadcn theme.

### Cards

- `rounded-lg border border-border bg-card p-6`
- No box-shadow by default. Hover state may add `shadow-sm` or `shadow-md` if interactive.
- Candidate cards are uniform in size. Never make one card larger than another.

### Buttons

- **Primary**: `bg-primary text-primary-foreground rounded-md px-5 py-2.5 font-medium`
- **Secondary/outline**: `border border-border text-foreground rounded-md px-5 py-2.5 hover:bg-secondary`
- **Ghost**: transparent background, text inherits, `hover:bg-accent`
- Transitions: `transition-colors duration-150`

### Links

- Body text links: `text-primary`
- Navigation links: `text-foreground no-underline hover:text-primary transition-colors`
- Arrow links ("Read more →"): `text-sm font-medium text-primary` with a trailing `→` character

### Dividers

- Use `border-t border-border` or `<hr className="border-border" />` for horizontal section breaks.

### Tags / Badges / Labels

- `text-xs font-medium tracking-widest uppercase text-muted-foreground`
- When they have backgrounds: `bg-muted text-muted-foreground rounded-full px-3 py-1`

### Navigation

- Top nav: logo left, links right, single-row, separated by `border-b border-border`.
- Mobile: `<details>` based dropdown menu.
- Nav links: `text-sm text-foreground no-underline hover:bg-secondary rounded-md px-3 py-2`.

### Footer

- Top border: `border-t border-border mt-12 pt-6`
- Text: `text-sm text-muted-foreground`
- Links: `text-muted-foreground hover:text-foreground transition-colors`

---

## 6. Imagery & Media

- Candidate photos should be high-quality, consistently sized, and shown within uniform containers.
- Use `object-cover` for all photos to prevent distortion.
- Photos should have subtle `rounded-lg` corners, never circular crops.
- No decorative stock photos. Only real candidate imagery or iconographic illustrations.

---

## 7. Motion & Interaction

- **Restraint.** No flashy entrance animations. No parallax. No particle effects.
- **Transitions only.** Use `transition-colors`, `transition-opacity`, and `transition-all` with `duration-150` or `duration-200`.
- **Hover states** should provide clear feedback without being distracting.
- **Focus rings** use `ring-2 ring-ring ring-offset-2` for accessibility.

---

## 8. Accessibility

- Color contrast: all text must meet WCAG AA (4.5:1 for body, 3:1 for large text).
- All interactive elements must have visible focus states.
- Images must have descriptive `alt` text.
- Semantic HTML: headings, landmarks, lists, tables — always use the correct element.

---

## 9. Anti-Patterns — DO NOT

These are explicitly banned:

- **No hardcoded colors.** Always use theme tokens (`bg-background`, `text-primary`, etc.). Never write `bg-[#xxx]` or inline `color:` styles.
- **No custom CSS for components.** All component styling is Tailwind utilities only. The `styles.css` file is reserved for the Shadcn theme definition.
- **No Inter, Roboto, or Arial as primary fonts.** The type stack is `Instrument Serif` + `DM Sans`.
- **No heavy box-shadows.** One `shadow-sm` on hover is the max for cards.
- **No candidate-specific colors.** All candidates get identical visual treatment.
- **No emoji in UI** (except the flag in the brand). The tone is journalistic.
- **No generic AI-slop aesthetics.** If it looks like a default Tailwind template, redesign it.

---

## 10. Quick Reference for Agents

When building a new page or component:

1. Headings (`h1`, `h2`) automatically use `font-serif` (Instrument Serif) via the CSS base layer.
2. Background = `bg-background`, text = `text-foreground`.
3. Cards = `rounded-lg border border-border bg-card p-6`.
4. Links = `text-primary`.
5. Labels = `text-xs font-medium tracking-widest uppercase text-muted-foreground`.
6. Spacing between sections = use `space-y-*` or margin utilities generously.
7. Max width = `max-w-7xl mx-auto` (already set in layout).
8. Buttons = use Shadcn `<Button>` with `variant="default"` (green) or `variant="outline"`.
9. Dividers = `border-t border-border`.
10. All styling is Tailwind utility classes — no custom CSS classes for components.
