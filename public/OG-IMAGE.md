# Open Graph image

`og-image.jpg` (1200×630) is the social preview image referenced in `index.html` (`og:image`, `twitter:image`).

A custom designed asset is in place. `scripts/generate-seo.mjs` skips generating `og-image.jpg` when this file already exists, so `pnpm build` will not overwrite it.

To replace the image: update `public/og-image.jpg` (keep 1200×630), then deploy. To revert to the build-time placeholder, delete `public/og-image.jpg` and run `pnpm generate:seo` or `pnpm build`.
