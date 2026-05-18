import { createClient } from '@sanity/client';
import { encode as encodeJpeg } from 'jpeg-js';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  FALLBACK_CATEGORIES,
  categoryUrl,
  categoryLabel,
} from './seo-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const BRAND_BG = { r: 15, g: 17, b: 21 };
const BRAND_ACCENT = { r: 157, g: 192, b: 255 };

async function fetchCategories() {
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2024-05-17',
    useCdn: true,
  });

  try {
    const rows = await client.fetch(
      `*[_type == "category" && defined(slug.current)] | order(title asc) {
        title,
        "slug": slug.current
      }`,
    );
    if (!rows?.length) return FALLBACK_CATEGORIES;
    return rows.map(({ title, slug }) => ({
      title,
      slug,
      label: categoryLabel(title),
    }));
  } catch (err) {
    console.warn('[generate-seo] Sanity fetch failed, using fallback categories:', err.message);
    return FALLBACK_CATEGORIES;
  }
}

function fillSolid(data, width, height, color) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (width * y + x) << 2;
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 255;
    }
  }
}

function drawOgAccent(data, width, height) {
  const barW = Math.round(width * 0.42);
  const barH = 6;
  const left = Math.round((width - barW) / 2);
  const top = Math.round(height * 0.54);
  for (let y = top; y < top + barH; y++) {
    for (let x = left; x < left + barW; x++) {
      const i = (width * y + x) << 2;
      data[i] = BRAND_ACCENT.r;
      data[i + 1] = BRAND_ACCENT.g;
      data[i + 2] = BRAND_ACCENT.b;
    }
  }
}

function writeJpeg(filePath, width, height, paint) {
  const data = Buffer.alloc(width * height * 4);
  paint(data, width, height);
  const { data: jpeg } = encodeJpeg({ data, width, height }, 88);
  writeFileSync(filePath, jpeg);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeMinimalPng(filePath, width, height, color) {
  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const o = rowStart + 1 + x * 3;
      raw[o] = color.r;
      raw[o + 1] = color.g;
      raw[o + 2] = color.b;
    }
  }
  const compressed = deflateSync(raw);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcBuf));
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(filePath, png);
}

function generateRasterAssets() {
  mkdirSync(publicDir, { recursive: true });

  const ogPath = join(publicDir, 'og-image.jpg');
  if (!existsSync(ogPath)) {
    writeJpeg(ogPath, 1200, 630, (data, w, h) => {
      fillSolid(data, w, h, BRAND_BG);
      drawOgAccent(data, w, h);
    });
  }

  for (const { name, size } of [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ]) {
    writeMinimalPng(join(publicDir, name), size, size, BRAND_BG);
  }

  try {
    copyFileSync(join(publicDir, 'logo.svg'), join(publicDir, 'favicon.svg'));
  } catch {
    writeFileSync(
      join(publicDir, 'favicon.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1e1e1e"/></svg>',
    );
  }
}

function writeSitemap(categories) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
    ...categories.map(cat => ({
      loc: categoryUrl(cat.slug),
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const body = urls
    .map(
      ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n');

  writeFileSync(
    join(publicDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`,
  );
}

function writeLlmsTxt(categories) {
  const categoryLines = categories
    .map(cat => `- ${cat.label}: ${categoryUrl(cat.slug)}`)
    .join('\n');

  writeFileSync(
    join(publicDir, 'llms.txt'),
    `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

${SITE_NAME} is a curated directory of standout design portfolio websites across product design, brand design, web design, and motion / 3D. Use this file to understand site structure and preferred crawl targets.

## Canonical site
- ${SITE_URL}

## Main categories
- Homepage: ${SITE_URL}/
${categoryLines}

## Preferred crawl sections
- Homepage hero and portfolio directory grid
- Category listing pages under /category/
- Public portfolio detail pages (hash routes: /#/portfolio/{slug})

## Do not crawl
- /studio/ (Sanity CMS admin)
- Build artifacts and source maps

## Optional
- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
`,
  );
}

function writeWebManifest() {
  writeFileSync(
    join(publicDir, 'site.webmanifest'),
    JSON.stringify(
      {
        name: SITE_NAME,
        short_name: 'BPW',
        description: DEFAULT_DESCRIPTION,
        start_url: '/',
        display: 'standalone',
        background_color: '#0f1115',
        theme_color: '#0f1115',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      null,
      2,
    ) + '\n',
  );
}

async function main() {
  const categories = await fetchCategories();
  mkdirSync(publicDir, { recursive: true });
  const hadCustomOg = existsSync(join(publicDir, 'og-image.jpg'));
  generateRasterAssets();
  writeSitemap(categories);
  writeLlmsTxt(categories);
  writeWebManifest();
  const ogNote = hadCustomOg ? 'kept custom og-image.jpg' : 'og-image.jpg';
  console.log(
    `[generate-seo] Wrote sitemap (${categories.length + 1} URLs), llms.txt, icons, ${ogNote}`,
  );
}

main().catch(err => {
  console.error('[generate-seo] Failed:', err);
  process.exit(1);
});
