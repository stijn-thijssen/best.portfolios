import {defineCliConfig} from 'sanity/cli'
import {SANITY_DEPLOYMENTS} from './deployments'

export default defineCliConfig({
  api: {
    projectId: 'wxgd4va0',
    dataset: 'production'
  },
  project: {
    basePath: '/studio',
  },
  deployment: {
    /** best-portfolios-phi.vercel.app/studio */
    appId: process.env.SANITY_STUDIO_APP_ID ?? SANITY_DEPLOYMENTS.studio,
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
