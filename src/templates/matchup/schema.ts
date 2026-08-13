import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'
import { type Sport, SPORTS } from '../../config'
import { DREXEL_TEAM_ID } from '../../data/teams'

export type MatchupProps = {
  sport: Sport
  homeTeamId: number
  awayTeamId: number
  homeLogoScale: number
  awayLogoScale: number
  venue: string
  location: string
  /** Optional override; empty uses the bundled Independence logo. */
  sponsorLogoUrl: string
}

export const matchupDefaults: MatchupProps = {
  sport: 'mens-basketball',
  homeTeamId: DREXEL_TEAM_ID,
  awayTeamId: 0,
  homeLogoScale: 2,
  awayLogoScale: 2,
  venue: 'DASKALAKIS ATHLETIC CENTER',
  location: 'PHILADELPHIA, PA',
  sponsorLogoUrl: '',
}

export const matchupSchema = z.object({
  sport: z.enum(SPORTS),
  homeTeamId: z.number().int(),
  awayTeamId: z.number().int(),
  homeLogoScale: z.number().positive(),
  awayLogoScale: z.number().positive(),
  venue: z.string(),
  location: z.string(),
  sponsorLogoUrl: z.string(),
}) satisfies z.ZodType<MatchupProps>

export const matchupTemplateSchema: TemplateSchema<MatchupProps> = {
  id: 'matchup',
  name: 'Matchup',
  route: '/graphics/p/dtv-2026/matchup',
  schema: matchupSchema,
  defaults: matchupDefaults,
  fields: {
    sport: {
      label: 'Sport',
      section: 'TEAMS',
      type: 'select',
      options: [
        { value: 'mens-basketball', label: "Men's Basketball" },
        { value: 'womens-basketball', label: "Women's Basketball" },
        { value: 'wrestling', label: 'Wrestling' },
      ],
    },
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
    venue: { label: 'Venue', section: 'CONTENT' },
    location: { label: 'Location', section: 'CONTENT' },
    sponsorLogoUrl: { label: 'Sponsor logo URL override', section: 'BRAND' },
  },
  transition: { inMs: 4200, outMs: 500 },
  live: {
    bind: {
      sport: 'config.sport',
      homeTeamId: 'config.homeTeamId',
      awayTeamId: 'config.awayTeamId',
    },
  },
}
