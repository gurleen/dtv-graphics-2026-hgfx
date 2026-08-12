import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'
import { type Sport, SPORTS } from '../../config'
import { DREXEL_TEAM_ID } from '../../data/teams'

export type MatchupProps = {
  sport: Sport
  homeTeamId: number
  awayTeamId: number
  venue: string
  location: string
  /** Optional override; empty uses the bundled Independence logo. */
  sponsorLogoUrl: string
  /** Optional override; empty uses the bundled CAA logo. */
  basketballConfLogoUrl: string
  /** Optional override; empty uses the bundled EIWA logo. */
  wrestlingConfLogoUrl: string
}

export const matchupDefaults: MatchupProps = {
  sport: 'mens-basketball',
  homeTeamId: DREXEL_TEAM_ID,
  awayTeamId: 0,
  venue: 'DASKALAKIS ATHLETIC CENTER',
  location: 'PHILADELPHIA, PA',
  sponsorLogoUrl: '',
  basketballConfLogoUrl: '',
  wrestlingConfLogoUrl: '',
}

export const matchupSchema = z.object({
  sport: z.enum(SPORTS),
  homeTeamId: z.number().int(),
  awayTeamId: z.number().int(),
  venue: z.string(),
  location: z.string(),
  sponsorLogoUrl: z.string(),
  basketballConfLogoUrl: z.string(),
  wrestlingConfLogoUrl: z.string(),
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
    venue: { label: 'Venue', section: 'CONTENT' },
    location: { label: 'Location', section: 'CONTENT' },
    sponsorLogoUrl: { label: 'Sponsor logo URL override', section: 'BRAND' },
    basketballConfLogoUrl: { label: 'Basketball conf logo URL override', section: 'BRAND' },
    wrestlingConfLogoUrl: { label: 'Wrestling conf logo URL override', section: 'BRAND' },
  },
  transition: { inMs: 2500, outMs: 500 },
  live: {
    bind: {
      sport: 'config.sport',
      homeTeamId: 'config.homeTeamId',
      awayTeamId: 'config.awayTeamId',
    },
  },
}
