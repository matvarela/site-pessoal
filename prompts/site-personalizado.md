---
name: site-personalizado-matheus
goal: Redesign the personal portfolio to feel as distinctive as to-portfolio.com, while keeping the current vanilla HTML/CSS/JS data-driven structure.
---

# Prompt — Site pessoal system-style (Matheus Varela Mendes)

You are a senior creative front-end designer and engineer. Redesign this personal portfolio so the first impression feels like a custom interactive system — not a generic résumé template.

## Role

Build a memorable, highly personalized portfolio for a data specialist. Prioritize craft, spatial composition, and motion. Keep the stack and content architecture of the existing repo.

## Context

```xml
<profile>
  Name: Matheus Varela Mendes
  Role: Especialista em Dados | Engenheiro de Analytics
  Location: Rio de Janeiro, RJ
  Highlights: Microsoft Fabric governance, 220+ corporate reports, Direct Lake performance wins, DP-700 / PL-300 and other Microsoft certs
  Stack preference: vanilla HTML5 + CSS3 + JavaScript (content in js/data.js, render in js/main.js)
</profile>

<repo_structure>
  index.html — semantic shell
  css/style.css — design tokens + layout
  js/data.js — ONLY file for content edits
  js/main.js — rendering + interactions
  assets/favicon.svg
</repo_structure>

<reference_site>
  URL: https://to-portfolio.com/
  Extract spirit, not code:
  - System-style UI with bracketed labels like [ PORTFOLIO : VER_1.0.0 ]
  - Light monochrome concrete/gray canvas (#E6E6E6 range), not purple gradients
  - Monospace HUD metadata (MODULE, PID, timestamps)
  - Spatial depth: floating geometry, node network, data streams
  - Boot/transition moment ("Reconstructing...")
  - Custom cursor / pointer presence
  - Full-viewport first screen as one composition
  - Expressive sans + mono typography (never Inter/Roboto/Arial as primary)
</reference_site>
```

## Design direction (must follow)

1. **Concept:** "Data Operations Console" — clinical, precise, futuristic, personal to Matheus.
2. **Brand first:** The name **Matheus Varela Mendes** is the hero-level signal. No eyebrow can overpower it.
3. **Hero budget only:** brand, one headline, one short supporting sentence, one CTA group, one dominant visual plane. No stats, schedules, or promo chips in the first viewport.
4. **Visual plane:** full-bleed interactive canvas (grid/network + floating geometric forms). Not an inset card image.
5. **Palette:** light system gray + near-black ink + one restrained signal accent (status/live). Avoid purple themes, cream+terracotta clichés, and generic cyan glassmorphism.
6. **Motion (minimum 3):** boot overlay exit, cursor/pointer presence, scroll reveals; optional floating geometry drift.
7. **Cards:** only where they support interaction or scannable content blocks after the hero. Never in the hero.
8. **Responsive:** excellent on mobile and desktop; respect `prefers-reduced-motion`.

## Technical constraints

- Keep vanilla HTML/CSS/JS — no React/Next/Three.js dependency required.
- Keep content editable via `js/data.js`.
- Preserve sections conceptually: Sobre, Experiência, Habilidades, Formação, Contato (you may rename labels to system style, e.g. `// about`).
- Accessibility: semantic HTML, focus-visible, ARIA where needed.
- Performance: no heavy WebGL unless lightweight canvas/SVG can deliver the feel.

## Output format

Deliver:

1. Updated `index.html`, `css/style.css`, `js/main.js`, `js/data.js` (if new fields), `assets/favicon.svg`
2. A short changelog of design decisions (5–8 bullets)
3. Confirm hero passes the brand test: without the nav, it still clearly belongs to Matheus

## Anti-goals

- Do not clone to-portfolio.com pixel-for-pixel
- Do not keep the old dark cyan glassmorphism look
- Do not put metric strips or certification badges in the hero
- Do not write vague copy like "passionate about data"

## Acceptance checks

- [ ] First viewport is one composition with brand dominance
- [ ] Light system aesthetic with mono HUD details
- [ ] Content still driven by `data.js`
- [ ] Desktop + mobile readable
- [ ] At least 3 intentional motions
- [ ] Looks custom enough that a stranger would stop scrolling
