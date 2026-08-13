import { definePackage, defineTemplate } from '@hydra-tv/hydra-gfx-sdk'
import {
  packageConfigDefaults,
  packageConfigFields,
  packageConfigSchema,
} from './config'
import { templateRegistry, type TemplateId } from './templates/registry'

const templates = {
  matchup: defineTemplate(templateRegistry.matchup),
  'score-to-break': defineTemplate(templateRegistry['score-to-break']),
  'talent-single': defineTemplate(templateRegistry['talent-single']),
  'talent-double': defineTemplate(templateRegistry['talent-double']),
} satisfies { [K in TemplateId]: ReturnType<typeof defineTemplate> }

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
  templates: Object.values(templates),
})
