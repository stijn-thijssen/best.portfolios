# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install --ignore-scripts   # install dependencies
pnpm dev                        # start dev server (Vite, http://localhost:5173)
pnpm build                      # production build → dist/
pnpm preview                    # preview production build locally
```

There is no lint or test setup yet.

## Architecture

This is a React 18 + Vite app. The entry point is `index.html` → `src/main.jsx` → `src/App.jsx`.

**Framer Motion setup:** `main.jsx` wraps the app in `<LazyMotion features={domAnimation}>` using the `domAnimation` bundle to keep the bundle small. Components use the `m` shorthand (imported from `framer-motion`) rather than the full `motion` component — keep this pattern when adding animations.

**Styling:** plain CSS in `src/styles.css`. Dark-only theme with a fixed palette (`#0f1115` background, `#e9ecf5` text, `#9dc0ff` accent). Layout is a single centered column (`max-width: 960px`). Responsive grid uses `auto-fit` with `minmax(220px, 1fr)`.

**Deployment:** Vercel, no config file needed — Vite is auto-detected.

## Platform rules (from `rules.md`)

- Keep code minimal; prefer scalable architecture over shortcuts.
- Performance is a priority: keep animations smooth and fast.
- When in doubt, ask before implementing assumptions.
