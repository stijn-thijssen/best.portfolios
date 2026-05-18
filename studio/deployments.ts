/**
 * Sanity Studio deployment IDs (sanity.io/manage → project wxgd4va0 → Studios)
 * @see https://www.sanity.io/manage/project/wxgd4va0/studios
 *
 * CORS (API → CORS origins): add both production URLs plus local dev:
 * - https://best-portfolios-phi.vercel.app
 * - https://best-portfolios-ten.vercel.app
 * - http://localhost:5173
 * CLI: `npx sanity cors add <origin> --credentials` (from studio/)
 */
export const SANITY_DEPLOYMENTS = {
  phi: {
    host: 'best-portfolios-phi.vercel.app',
    /** Main site deployment */
    main: 'oj0seqchsq1v850408almw98',
    /** /studio on phi */
    studio: 'n7qbu5yjg4gxpbtwov428wxc',
  },
  ten: {
    host: 'best-portfolios-ten.vercel.app',
    /** /studio on ten */
    studio: 'x5yhrgklng7si23o0oiob1yb',
  },
} as const

function normalizeHost(value: string): string {
  return value.replace(/^https?:\/\//, '').split('/')[0] ?? ''
}

/** Picks the studio appId for the current Vercel deployment (or phi locally). */
export function resolveStudioAppId(): string {
  if (process.env.SANITY_STUDIO_APP_ID) {
    return process.env.SANITY_STUDIO_APP_ID
  }

  const host = normalizeHost(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? '',
  )

  if (host.includes('best-portfolios-ten')) {
    return SANITY_DEPLOYMENTS.ten.studio
  }

  return SANITY_DEPLOYMENTS.phi.studio
}
