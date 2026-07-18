# AGENTS.md

## Cursor Cloud specific instructions

This is a **static website** (portfolio landing page) built with plain HTML5, CSS3, and
vanilla JavaScript. There is **no build step, no package manager, and no test suite**.

### Structure
- `index.html` — page shell; sections are empty and filled in at runtime by JS.
- `css/style.css` — all styling (design tokens, glassmorphism, responsive layout).
- `js/data.js` — the single source of content; edit this to change page text/data.
- `js/main.js` — renders `data.js` into the DOM and wires up interactions (typewriter,
  navbar scroll/active-link, mobile menu, reveal-on-scroll via `IntersectionObserver`).
- `assets/favicon.svg` — favicon.

### Run (development)
Serve the folder over HTTP (opening `index.html` via `file://` works too, but a server
matches production behavior):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Any static file server works (e.g. `npx serve`).

### Lint / Test / Build
- **Lint:** none configured.
- **Test:** none (no framework). Verify visually in the browser and by checking assets
  return HTTP 200.
- **Build:** none — files are served as-is.

### Notes
- Content is injected on `DOMContentLoaded`, so JS must load for the page to show text.
- To update content, edit `js/data.js` only; `main.js` re-renders everything from it.
