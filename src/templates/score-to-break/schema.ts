import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'
import { DREXEL_TEAM_ID } from '../../data/teams'

export type ScoreToBreakProps = {
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  period: string
  /** Optional override; empty uses the bundled Independence logo. */
  sponsorLogoUrl: string
}

export const scoreToBreakDefaults: ScoreToBreakProps = {
  homeTeamId: DREXEL_TEAM_ID,
  awayTeamId: 0,
  homeScore: 0,
  awayScore: 0,
  period: '1ST QUARTER',
  sponsorLogoUrl: '',
}

export const scoreToBreakSchema = z.object({
  homeTeamId: z.number().int(),
  awayTeamId: z.number().int(),
  homeScore: z.number(),
  awayScore: z.number(),
  period: z.string(),
  sponsorLogoUrl: z.string(),
}) satisfies z.ZodType<ScoreToBreakProps>

export const scoreToBreakTemplateSchema: TemplateSchema<ScoreToBreakProps> = {
  id: 'score-to-break',
  name: 'Score To Break',
  route: '/graphics/p/dtv-2026/score-to-break',
  schema: scoreToBreakSchema,
  defaults: scoreToBreakDefaults,
  fields: {
    homeTeamId: { label: 'Home team ID', section: 'TEAMS', type: 'number' },
    awayTeamId: { label: 'Away team ID', section: 'TEAMS', type: 'number' },
    homeScore: { label: 'Home score', section: 'SCORE', type: 'number' },
    awayScore: { label: 'Away score', section: 'SCORE', type: 'number' },
    period: { label: 'Period', section: 'SCORE' },
    sponsorLogoUrl: { label: 'Sponsor logo URL override', section: 'BRAND' },
  },
  transition: { inMs: 1000, outMs: 500 },
  live: {
    bind: {
      homeTeamId: 'config.homeTeamId',
      awayTeamId: 'config.awayTeamId',
    },
  },
}
