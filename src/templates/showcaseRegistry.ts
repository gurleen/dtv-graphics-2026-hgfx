import type { ComponentType } from 'react'
import type { TemplateId } from './registry'

export type ShowcaseProps = {
  autoIn?: boolean
  awayTeamId?: number
}

type ShowcaseLoader = () => Promise<{ default: ComponentType<ShowcaseProps> }>

/**
 * Stakeholder / demo preview for each registered template.
 * Keys must match `templateRegistry` exactly — TypeScript fails if a
 * template is added without a Showcase (or a Showcase is added without a
 * registry entry).
 */
export const showcaseRegistry = {
  matchup: () => import('./matchup/Showcase'),
  'score-to-break': () => import('./score-to-break/Showcase'),
  'talent-single': () => import('./talent/single/Showcase'),
  'talent-double': () => import('./talent/double/Showcase'),
} satisfies { [K in TemplateId]: ShowcaseLoader }
