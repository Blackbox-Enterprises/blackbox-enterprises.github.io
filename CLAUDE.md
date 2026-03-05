# CLAUDE.md — Blackbox Enterprises GitHub Pages

## Project Overview

Static GitHub Pages site for **Blackbox Enterprises**, a subsidiary of **BlackRoad OS, Inc.** The site serves as a landing page for the enterprise automation platform (n8n, Airbyte, Prefect, Temporal).

- **URL**: https://blackbox-enterprises.github.io
- **License**: Proprietary (BlackRoad OS, Inc.) — not open source
- **Owner**: Alexa Louise Amundson / BlackRoad OS, Inc.

## Tech Stack

- Pure HTML + inline CSS (no JavaScript frameworks, no build tools)
- No package manager, no dependencies, no transpilation
- Google Fonts (Inter) loaded via CDN
- GitHub Pages for hosting (`.nojekyll` disables Jekyll)

## Repository Structure

```
├── index.html                          # Main landing page (all HTML + CSS inline)
├── .nojekyll                           # Disables Jekyll on GitHub Pages
├── LICENSE                             # BlackRoad OS proprietary license
├── README.md                           # Minimal project description
├── CLAUDE.md                           # This file
└── .github/
    └── workflows/
        └── continuous-engine.yml       # Self-chaining perpetual workflow
```

This is a minimal repo — the entire site is a single `index.html` file with inline styles.

## Development Workflow

### Making Changes

1. Edit `index.html` directly — there is no build step
2. Preview locally by opening `index.html` in a browser
3. Push to `main` branch to deploy via GitHub Pages

### No Build/Test/Lint Commands

There are no build tools, test frameworks, or linters configured. Changes are validated visually.

## Key Conventions

### Commit Messages

- Use conventional-style prefixes: `feat:`, `fix:`, `chore:`, `legal:`, etc.
- Emoji prefixes are used in workflow names but commit messages use text prefixes
- Keep messages descriptive and concise

### CSS Conventions (in index.html)

- Dark theme: background `#000000`, brand color `#212121`
- Glassmorphism effects using `backdrop-filter: blur()`
- CSS Grid and Flexbox for layout
- Keyframe animations: `gridScroll`, `pulse`, `shimmer`, `bounce`
- Responsive design via media queries
- All styles are inline in `<style>` tags within `index.html`

### Branch Naming

- `main` — production branch (deployed to GitHub Pages)
- `claude/<feature>-<suffix>` — AI-assisted feature branches

## CI/CD: Continuous Engine

The workflow in `.github/workflows/continuous-engine.yml` is a **self-chaining perpetual loop** — not a typical CI/CD pipeline:

- Runs on self-hosted runners (`blackroad-fleet`)
- Chains itself via `gh workflow run` after each ~6h iteration
- Cron schedule (`*/5 * * * *`) acts as self-healing fallback
- Monitors 6 agents: LUCIDIA, ALICE, OCTAVIA, PRISM, ECHO, CIPHER
- Performs health checks on `localhost:3000` and journal syncs
- **Do not modify** without understanding the self-chaining architecture

## Important Notes

- This is **proprietary software** — all rights reserved by BlackRoad OS, Inc.
- The site represents 17 GitHub organizations with 1,800+ repositories
- External links point to GitHub org (`github.com/Blackbox-Enterprises`) and BlackRoad OS (`blackroad.ai`)
- Copyright year: 2026
