import { definePackage, defineTemplate } from '@hydra-tv/hydra-gfx-sdk'
import {
  packageConfigDefaults,
  packageConfigFields,
  packageConfigSchema,
} from './config'
import { lowerThirdTemplateSchema } from './templates/lower-third/schema'
import { matchupTemplateSchema } from './templates/matchup/schema'
import { scoreToBreakTemplateSchema } from './templates/score-to-break/schema'
import { talentSingleTemplateSchema } from './templates/talent/single/schema'
import { talentDoubleTemplateSchema } from './templates/talent/double/schema'

export default definePackage({
  id: 'dtv-2026',
  name: 'DTV Graphics 2026',
  version: '0.1.0',
  config: {
    schema: packageConfigSchema,
    defaults: packageConfigDefaults,
    fields: packageConfigFields,
  },
  panels: [
    {
      id: 'settings',
      label: 'SETTINGS',
      Panel: () => import('./panels/SettingsPanel'),
    },
  ],
  templates: [
    defineTemplate({
      ...lowerThirdTemplateSchema,
      Render: () => import('./templates/lower-third/Graphic'),
      Controls: () => import('./templates/lower-third/Controls'),
      PreviewControls: () => import('./templates/lower-third/Controls'),
    }),
    defineTemplate({
      ...matchupTemplateSchema,
      Render: () => import('./templates/matchup/Graphic'),
    }),
    defineTemplate({
      ...scoreToBreakTemplateSchema,
      Render: () => import('./templates/score-to-break/Graphic'),
    }),
    defineTemplate({
      ...talentSingleTemplateSchema,
      Render: () => import('./templates/talent/single/Graphic'),
      Controls: () => import('./templates/talent/single/Controls'),
      PreviewControls: () => import('./templates/talent/single/Controls'),
    }),
    defineTemplate({
      ...talentDoubleTemplateSchema,
      Render: () => import('./templates/talent/double/Graphic'),
      Controls: () => import('./templates/talent/double/Controls'),
      PreviewControls: () => import('./templates/talent/double/Controls'),
    }),
  ],
})
