import { z } from 'zod'
import type { FieldDef } from '@hydra-tv/hydra-gfx-runtime/types'
import { DREXEL_TEAM_ID } from './data/teams'

export const SPORTS = ['mens-basketball', 'womens-basketball', 'wrestling'] as const
export type Sport = (typeof SPORTS)[number]

export const packageConfigSchema = z.object({
  sport: z.enum(SPORTS),
  homeTeamId: z.number().int(),
  awayTeamId: z.number().int(),
})

export type PackageConfig = z.infer<typeof packageConfigSchema>

export const packageConfigDefaults: PackageConfig = {
  sport: 'mens-basketball',
  homeTeamId: DREXEL_TEAM_ID,
  awayTeamId: 0,
}

export const packageConfigFields: {
  [K in keyof PackageConfig & string]?: FieldDef
} = {
  sport: {
    label: 'Sport',
    type: 'select',
    options: [
      { value: 'mens-basketball', label: "Men's Basketball" },
      { value: 'womens-basketball', label: "Women's Basketball" },
      { value: 'wrestling', label: 'Wrestling' },
    ],
  },
  homeTeamId: { label: 'Home team ID', type: 'number' },
  awayTeamId: { label: 'Away team ID', type: 'number' },
}

export function sportLabel(sport: Sport): string {
  switch (sport) {
    case 'mens-basketball':
      return "Men's Basketball"
    case 'womens-basketball':
      return "Women's Basketball"
    case 'wrestling':
      return 'Wrestling'
  }
}
