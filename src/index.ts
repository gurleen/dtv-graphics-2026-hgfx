import { definePackage, defineTemplate } from '@hydra-tv/hydra-gfx-sdk'
import { lowerThirdTemplateSchema } from './templates/lower-third/schema'

export default definePackage({
  id: 'dtv-2026',
  name: 'DTV Graphics 2026',
  version: '0.1.0',
  templates: [
    defineTemplate({
      ...lowerThirdTemplateSchema,
      Render: () => import('./templates/lower-third/Graphic'),
      Controls: () => import('./templates/lower-third/Controls'),
      PreviewControls: () => import('./templates/lower-third/Controls'),
    }),
  ],
})
