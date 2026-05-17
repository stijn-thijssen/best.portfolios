import { existsSync } from 'node:fs';

const hasAstroBinary = existsSync('node_modules/.bin/astro');

if (!hasAstroBinary) {
  console.error('\nMissing dependencies: run `npm install` before starting the dev server.\n');
  process.exit(1);
}
