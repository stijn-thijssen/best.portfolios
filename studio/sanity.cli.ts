import {defineCliConfig} from 'sanity/cli'
import {resolveStudioAppId} from './deployments'

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
    appId: resolveStudioAppId(),
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
