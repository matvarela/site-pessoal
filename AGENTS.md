# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **fully static personal résumé/portfolio site** (`index.html` + `css/style.css` + `js/*.js`). There is no package manager, build step, bundler, or test suite.

- **Content lives in `js/data.js`** — it is the single source of truth. `js/main.js` renders every section (hero, timeline, skills, education, contact) into the empty containers in `index.html` at `DOMContentLoaded`. Editing content means editing `data.js`; no rebuild is needed.
- **Run the dev server** from the repo root: `python3 -m http.server 8000`, then open `http://localhost:8000/`. `python3` is preinstalled. Any static file server works.
- **Do NOT open `index.html` via `file://`** for verification — the page relies on JS and fetches sibling assets; always serve over HTTP so relative paths and the browser environment behave correctly.
- **No install/update step is required** — there are no dependencies to fetch. The startup update script only verifies `python3` is present.
- **No lint or test tooling exists.** Do not assume `npm`/lint/test commands; there is no `package.json`. If asked to verify, serve the site and check pages render (content is JS-injected, so a plain HTTP 200 on `index.html` is not sufficient proof — confirm rendered content in a browser).
