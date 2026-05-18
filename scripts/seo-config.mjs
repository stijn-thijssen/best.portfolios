/** Shared SEO constants — used by build scripts and documented category URL pattern. */
export const SITE_URL = 'https://bestportfoliowebsites.com';
export const SITE_NAME = 'Best Portfolio Websites';
export const SITE_LANG = 'en';

export const DEFAULT_TITLE =
  'Best Portfolio Websites (2026) | Design Portfolio Inspiration';
export const DEFAULT_DESCRIPTION =
  'Discover the best portfolio websites from top product designers, brand designers, web creatives, motion artists, and digital studios. Curated portfolio inspiration, case studies, and creative work across UX, branding, web, and interactive design.';

export const ORGANIZATION_DESCRIPTION =
  'Curated directory of the best design portfolios across product, branding, motion, web, and digital design.';

export const SANITY_PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || 'wxgd4va0';
export const SANITY_DATASET = process.env.VITE_SANITY_DATASET || 'production';

/** Fallback when Sanity is unreachable at build time. */
export const FALLBACK_CATEGORIES = [
  {
    title: 'Product',
    slug: 'product-design-portfolios',
    label: 'Product Design Portfolios',
  },
  {
    title: 'Brand',
    slug: 'brand-design-portfolios',
    label: 'Brand Design Portfolios',
  },
  {
    title: 'Web',
    slug: 'web-design-portfolios',
    label: 'Web Design Portfolios',
  },
  {
    title: 'Motion & 3D',
    slug: 'motion-and-3d-portfolios',
    label: 'Motion & 3D Portfolios',
  },
];

export function categoryPath(slug) {
  return `/${slug}`;
}

export function categoryUrl(slug) {
  return `${SITE_URL}${categoryPath(slug)}`;
}

export function categoryLabel(title) {
  const map = {
    Product: 'Product Design Portfolios',
    Brand: 'Brand Design Portfolios',
    Web: 'Web Design Portfolios',
    'Motion & 3D': 'Motion & 3D Portfolios',
  };
  return map[title] ?? `${title} Portfolios`;
}
