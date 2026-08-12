import { Row, Column, Image } from '@hydra-tv/hydra-gfx-runtime'
import { CroppedImage } from '../../components/CroppedImage'
import { getTeamKnockoutLogo, type TeamInfo } from '../../data/teams'

export const STB_FONT = 'Zuume, system-ui, sans-serif'
export const STB_LOGO_SCALE = 2.5

const EMPTY_TEAM_FILL = '#141515'
const PANEL_BG = '#131313'
const BOTTOM_BAR_BG = '#D3D1D1'

export type ScoreToBreakLayoutProps = {
  homeTeam: TeamInfo | undefined
  awayTeam: TeamInfo | undefined
  homeScore: number
  awayScore: number
  period: string
  sponsorLogoUrl: string
  homeLogoScale?: number
  awayLogoScale?: number
}

function teamFill(color: string | undefined): string {
  if (!color) return EMPTY_TEAM_FILL
  return color.startsWith('#') ? color : `#${color}`
}

export function ScoreToBreakLayout({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  period,
  sponsorLogoUrl,
  homeLogoScale = STB_LOGO_SCALE,
  awayLogoScale = STB_LOGO_SCALE,
}: ScoreToBreakLayoutProps) {
  return (
    <Column width={437} height={373} align="stretch" background={PANEL_BG}>
      <Row width={437} height={168} align="stretch" justify="start">
        <TeamBox team={awayTeam} logoScale={awayLogoScale} />
        <ScoreBox score={awayScore} isHome={false} />
      </Row>
      <Row width={437} height={168} align="stretch" justify="start">
        <TeamBox team={homeTeam} logoScale={homeLogoScale} />
        <ScoreBox score={homeScore} isHome={true} />
      </Row>
      <BottomBar periodText={period} sponsorLogoUrl={sponsorLogoUrl} />
    </Column>
  )
}

function TeamBox({
  team,
  logoScale,
}: {
  team: TeamInfo | undefined
  logoScale: number
}) {
  const logoUrl = team ? getTeamKnockoutLogo(team) : ''

  return (
    <Row
      width={183}
      height={168}
      justify="center"
      align="center"
      background={teamFill(team?.color)}
    >
      {logoUrl ? (
        <CroppedImage
          src={logoUrl}
          width={183}
          height={168}
          fit="cover"
          scale={logoScale}
          alt=""
        />
      ) : null}
    </Row>
  )
}

function ScoreBox({ score, isHome }: { score: number; isHome: boolean }) {
  const textId = isHome ? 'home-score' : 'away-score'

  return (
    <Row width={254} height={168} justify="center" align="center" background={PANEL_BG}>
      <div
        id={textId}
        style={{
          color: '#FFFFFF',
          fontSize: 120,
          fontFamily: STB_FONT,
          fontWeight: 900,
          fontStyle: 'italic',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {score}
      </div>
    </Row>
  )
}

function BottomBar({
  periodText,
  sponsorLogoUrl,
}: {
  periodText: string
  sponsorLogoUrl: string
}) {
  return (
    <Row
      width={437}
      height={37}
      justify="between"
      align="center"
      paddingX={8}
      background={BOTTOM_BAR_BG}
    >
      <Row width={150} height={37} align="center" justify="start">
        {sponsorLogoUrl ? (
          <Image src={sponsorLogoUrl} width={150} height={28} fit="contain" alt="" />
        ) : null}
      </Row>
      <div
        style={{
          color: '#000000',
          fontSize: 18,
          fontFamily: STB_FONT,
          fontWeight: 800,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {periodText.toUpperCase() || ' '}
      </div>
    </Row>
  )
}
