# Best Portfolios

Astro + React starter for a content-heavy web directory platform with Framer Motion enhancements and Vercel-ready deployment.

## Why Astro for this project

- Content-heavy pages are statically rendered by default for excellent performance.
- React is used only where interactivity is needed (islands architecture).
- Framer Motion is limited to interactive UI pieces to keep runtime JS lean.

## Quick start

```bash
npm install
npm run dev
```

## Scripts

- `npm run check:deps` - validates dependencies are installed.
- `npm run dev` - start Astro development server.
- `npm run build` - create production build.
- `npm run preview` - preview the production build locally.

## Deploy to Vercel

This project is compatible with Vercel out of the box.

1. Push this repository to GitHub.
2. Import it in Vercel.
3. Vercel will detect Astro and use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
