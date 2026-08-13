import { matchupTemplateSchema } from './matchup/schema'
import { scoreToBreakTemplateSchema } from './score-to-break/schema'
import { talentDoubleTemplateSchema } from './talent/double/schema'
import { talentSingleTemplateSchema } from './talent/single/schema'

/**
 * Source of truth for HYDRA templates and the stakeholder showcase.
 *
 * Showcase lazy-imports live in `showcaseRegistry.ts` (not here) so the
 * `.hgfx.js` bundler does not pull demo chrome into the package artifact.
 * `showcaseRegistry` is type-checked against these keys — adding a template
 * here without a Showcase will not compile.
 */
export const templateRegistry = {
  matchup: {
    ...matchupTemplateSchema,
    Render: () => import('./matchup/Graphic'),
  },
  'score-to-break': {
    ...scoreToBreakTemplateSchema,
    Render: () => import('./score-to-break/Graphic'),
  },
  'talent-single': {
    ...talentSingleTemplateSchema,
    Render: () => import('./talent/single/Graphic'),
    Controls: () => import('./talent/single/Controls'),
    PreviewControls: () => import('./talent/single/Controls'),
  },
  'talent-double': {
    ...talentDoubleTemplateSchema,
    Render: () => import('./talent/double/Graphic'),
    Controls: () => import('./talent/double/Controls'),
    PreviewControls: () => import('./talent/double/Controls'),
  },
}

export type TemplateId = keyof typeof templateRegistry

export const templateCatalog = Object.values(templateRegistry).map((entry) => ({
  id: entry.id as TemplateId,
  name: entry.name,
}))
