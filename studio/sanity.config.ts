import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {SANITY_DEPLOYMENTS} from './deployments'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',
  basePath: '/studio',
  appId: SANITY_DEPLOYMENTS.studio,

  projectId: 'wxgd4va0',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
