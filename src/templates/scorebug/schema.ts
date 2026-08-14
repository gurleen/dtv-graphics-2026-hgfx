import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'
import {
  basketballGameDefaults,
  type BasketballGameState,
} from '../../data/basketball'
import { DREXEL_TEAM_ID } from '../../data/teams'

export type ScorebugProps = {
  homeTeamId: number
  awayTeamId: number
  homeLogoScale: number
  awayLogoScale: number
} & BasketballGameState & {
  /** Optional override; empty uses the bundled Independence logo. */
  sponsorLogoUrl: string
}

export const scorebugDefaults: ScorebugProps = {
  homeTeamId: DREXEL_TEAM_ID,
  awayTeamId: 0,
  homeLogoScale: 1.8,
  awayLogoScale: 1.8,
  ...basketballGameDefaults,
  sponsorLogoUrl: '',
}

export const scorebugSchema = z.object({
  homeTeamId: z.number().int(),
  awayTeamId: z.number().int(),
  homeLogoScale: z.number().positive(),
  awayLogoScale: z.number().positive(),
  homeScore: z.number(),
  awayScore: z.number(),
  clock: z.string(),
  shotClock: z.number(),
  period: z.string(),
  homeTimeouts: z.number().int().min(0).max(4),
  awayTimeouts: z.number().int().min(0).max(4),
  homeBonus: z.boolean(),
  awayBonus: z.boolean(),
  sponsorLogoUrl: z.string(),
}) satisfies z.ZodType<ScorebugProps>

export const scorebugTemplateSchema: TemplateSchema<ScorebugProps> = {
  id: 'basketball-scorebug',
  name: 'Basketball Scorebug',
  route: '/graphics/p/dtv-2026/basketball-scorebug',
  schema: scorebugSchema,
  defaults: scorebugDefaults,
  fields: {
    homeTeamId: { label: 'Home team ID', section: 'TEAMS', type: 'number' },
    awayTeamId: { label: 'Away team ID', section: 'TEAMS', type: 'number' },
    homeLogoScale: {
      label: 'Home logo scale',
      section: 'TEAMS',
      type: 'slider',
      min: 0.8,
      max: 3.5,
      step: 0.05,
    },
    awayLogoScale: {
      label: 'Away logo scale',
      section: 'TEAMS',
      type: 'slider',
      min: 0.8,
      max: 3.5,
      step: 0.05,
    },
    homeScore: { label: 'Home score', section: 'SCORE', type: 'number' },
    awayScore: { label: 'Away score', section: 'SCORE', type: 'number' },
    clock: { label: 'Clock', section: 'CLOCK' },
    shotClock: { label: 'Shot clock', section: 'CLOCK', type: 'number' },
    period: { label: 'Period', section: 'CLOCK' },
    homeTimeouts: {
      label: 'Home timeouts',
      section: 'TIMEOUTS',
      type: 'number',
      min: 0,
      max: 4,
    },
    awayTimeouts: {
      label: 'Away timeouts',
      section: 'TIMEOUTS',
      type: 'number',
      min: 0,
      max: 4,
    },
    homeBonus: { label: 'Home bonus', section: 'TIMEOUTS', type: 'switch' },
    awayBonus: { label: 'Away bonus', section: 'TIMEOUTS', type: 'switch' },
    sponsorLogoUrl: { label: 'Sponsor logo URL override', section: 'BRAND' },
  },
  transition: { inMs: 900, outMs: 500 },
  live: {
    bind: {
      homeTeamId: 'config.homeTeamId',
      awayTeamId: 'config.awayTeamId',
      homeScore: 'data.basketball.homeScore',
      awayScore: 'data.basketball.awayScore',
      clock: 'data.basketball.clock',
      shotClock: 'data.basketball.shotClock',
      period: 'data.basketball.period',
      homeTimeouts: 'data.basketball.homeTimeouts',
      awayTimeouts: 'data.basketball.awayTimeouts',
      homeBonus: 'data.basketball.homeBonus',
      awayBonus: 'data.basketball.awayBonus',
    },
  },
}
