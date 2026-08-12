import teamsJson from './teams.json'

export type TeamInfo = {
  team_id: number
  abbreviation: string
  display_name: string
  short_name: string
  mascot: string
  nickname: string
  team: string
  color: string
  alternate_color: string
  group_id: number
  conference_short_name: string
  conference_name: string
  conference_id: number
  logo_name: string
  website: string
}

const IMAGES_BASE_URL = 'https://images.dragonstv.io'

/** Vendored team catalog (snapshot of the old SPX static-data/teams.json). */
export const teams: TeamInfo[] = teamsJson as TeamInfo[]

export function findTeam(teamId: number): TeamInfo | undefined {
  return teams.find((t) => t.team_id === teamId)
}

export function teamSearchOptions(): { value: string; label: string }[] {
  return teams.map((t) => ({
    value: String(t.team_id),
    label: t.display_name,
  }))
}

export function getTeamLogo(team: TeamInfo): string {
  return new URL(`/logos/${team.logo_name}`, IMAGES_BASE_URL).toString()
}

export function getTeamKnockoutLogo(team: TeamInfo): string {
  return new URL(`/logos-knockout/${team.logo_name}`, IMAGES_BASE_URL).toString()
}

/** Drexel Dragons — default home team. */
export const DREXEL_TEAM_ID = 2182
