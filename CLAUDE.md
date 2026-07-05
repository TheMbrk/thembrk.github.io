# CLAUDE.md

Project context for Claude when working in this repo.

## What this is

Personal portfolio website for **Mark Cyril Tubera** (Software Engineer / API Integration Specialist). Static site, no build step. Hosted on **GitHub Pages** at the repo `TheMbrk/thembrk.github.io`, so it serves as the user site `https://thembrk.github.io`. Pushing to the `main` branch deploys automatically (live in ~1 minute).

## Structure

- `index.html` — main single page. Sections: Hero, AI Demo (`#demo`), About, Projects, Experience, Skills, Contact. Uses a top nav (`MCT.` logo) and Google Fonts (Inter + JetBrains Mono).
- `css/style.css` — main styling (~1150 lines).
- `css/animations.css` — animation/keyframe styles.
- `js/main.js` — site logic: contact-form handler (Formspree) and chatbot widget (Cloudflare Worker call). See External services below.
- `js/typing.js` — typing/text animation (hero).
- `dashboard.html` — standalone **Job Tracker API** dashboard, a **Vue 3** app (Vue + axios from cdnjs) that calls the Railway-hosted API. Linked from the Projects section.
- `liquefaction-demo.html` — standalone live demo for the Liquefaction WebGIS thesis project, linked from Projects.
- `assets/Resume_Tubera_Mark.pdf` — resume linked from the page. NOTE: a duplicate copy also sits at repo root (`Resume_Tubera_Mark.pdf`); the page links to the `assets/` one.
- `deploy.bat` — Windows helper: prompts for a commit message, then `git pull` → `git add .` → `git commit` → `git push`. Gitignored.
- `.gitignore` — ignores `deploy.bat`.

## How to work on it

- Edit files directly; no compile/build. To preview locally, open `index.html` in a browser (or run a static server like `python -m http.server` from the repo root).
- To deploy: run `deploy.bat` (or `git add . && git commit -m "..." && git push`). GitHub Pages rebuilds from `main`.
- Keep everything static — no server-side code in this repo. (The Job Tracker API and chatbot backends live elsewhere.)

## External services

- **Contact form** posts to Formspree, form ID `xzdqwdka` (in `js/main.js`). It's live and delivering.
- **Chatbot widget** calls a Cloudflare Worker at `https://shrill-shadow-6aa5.jobs-markcyriltubera.workers.dev/`, POSTing `{ messages: [...] }` and reading back `{ reply }`. The Worker (not in this repo) holds the LLM logic and any API keys.
- **Job Tracker dashboard** (`dashboard.html`) calls a backend API hosted on Railway at `https://job-tracker-api-production-45c9.up.railway.app/api`. Source repo: `github.com/thembrk/job-tracker-api` (separate repo).

## Conventions

- Semantic HTML with ARIA labels; preserve accessibility when editing.
- Inline SVG icons (no icon library).
- Contact email shown on the page is `jobs.markcyriltubera@gmail.com`.

## History note

GitHub `main` was force-updated on 2026-07-05 (rewritten from another source), which had diverged from an older local copy. The local folder was reset to match `origin/main`. If local and remote ever diverge again, treat GitHub / the live site as the source of truth and `git reset --hard origin/main`.
