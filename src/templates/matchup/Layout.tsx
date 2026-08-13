import type { CSSProperties } from 'react'
import { Rect, Row, Column, Flex, Text, Image } from '@hydra-tv/hydra-gfx-runtime'
import { CroppedImage } from '../../components/CroppedImage'
import { getTeamKnockoutLogo, type TeamInfo } from '../../data/teams'

export const MATCHUP_FONT = 'Zuume, system-ui, sans-serif'
export const MATCHUP_LOGO_SCALE = 2
export const MATCHUP_LOGO_BASE_WIDTH = 300
export const MATCHUP_LOGO_HEIGHT = 189

const MATCHUP_TEXT_WIDTH = 260
const EMPTY_TEAM_FILL = '#141515'

function logoBoxWidth(logoScale: number): number {
  return Math.round(MATCHUP_LOGO_BASE_WIDTH * logoScale)
}

function teamBoxWidth(logoScale: number): number {
  return logoBoxWidth(logoScale) + MATCHUP_TEXT_WIDTH
}

function confBoxWidth(homeLogoScale: number, awayLogoScale: number): number {
  return Math.max(
    120,
    1920 - teamBoxWidth(homeLogoScale) - teamBoxWidth(awayLogoScale),
  )
}

export type MatchupLayoutProps = {
  presenter: string
  sponsorLogoUrl: string
  confLogoUrl: string
  venue: string
  location: string
  homeTeam: TeamInfo | undefined
  awayTeam: TeamInfo | undefined
  homeLogoScale?: number
  awayLogoScale?: number
}

function venueLine(venue: string, location: string): string {
  const v = venue.trim()
  const loc = location.trim()
  if (v && loc) return `${v} • ${loc}`
  return v || loc || ' '
}

function teamFill(color: string | undefined): string {
  if (!color) return EMPTY_TEAM_FILL
  return color.startsWith('#') ? color : `#${color}`
}

const SHEEN_DARK: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 28%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.22) 100%)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.28)',
}

const SHEEN_LIGHT: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  background:
    'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.02) 32%, rgba(20,40,60,0.06) 100%)',
  boxShadow:
    'inset 0 1px 0 rgba(0,0,0,0.12), inset 0 -1px 0 rgba(255,255,255,0.35)',
}

function ShapeSheen({ variant }: { variant: 'dark' | 'light' }) {
  return <div aria-hidden style={variant === 'light' ? SHEEN_LIGHT : SHEEN_DARK} />
}

const SHELL: CSSProperties = { position: 'relative' }
const SHELL_CONTENT: CSSProperties = { position: 'relative', zIndex: 1 }

export function MatchupLayout({
  presenter,
  sponsorLogoUrl,
  confLogoUrl,
  venue,
  location,
  homeTeam,
  awayTeam,
  homeLogoScale = MATCHUP_LOGO_SCALE,
  awayLogoScale = MATCHUP_LOGO_SCALE,
}: MatchupLayoutProps) {
  return (
    <Column width={1920} height="auto" align="stretch">
      <div style={{ overflow: 'hidden' }}>
        <SponsorBar presenter={presenter} sponsorLogoUrl={sponsorLogoUrl} />
      </div>
      <div style={{ overflow: 'hidden' }}>
        <Row width={1920} height={189} align="stretch" justify="start">
          <TeamBox isHome={false} team={awayTeam} logoScale={awayLogoScale} />
          <ConfBox
            confLogoUrl={confLogoUrl}
            width={confBoxWidth(homeLogoScale, awayLogoScale)}
          />
          <TeamBox isHome={true} team={homeTeam} logoScale={homeLogoScale} />
        </Row>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <BottomBar venue={venue} location={location} />
      </div>
    </Column>
  )
}

function SponsorBar({
  presenter,
  sponsorLogoUrl,
}: {
  presenter: string
  sponsorLogoUrl: string
}) {
  return (
    <div id="sponsor-bar" style={{ ...SHELL, background: '#141414' }}>
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <Row
          width={1920}
          height={72}
          justify="center"
          align="center"
          gap={20}
          padding={28}
        >
          <Text color="#FFFFFF" fontSize={48} fontFamily={MATCHUP_FONT} lineHeight={1.05} singleLine>
            {presenter}
          </Text>
          {sponsorLogoUrl ? (
            <Image src={sponsorLogoUrl} width={400} height={48} fit="contain" alt="" />
          ) : null}
        </Row>
      </div>
    </div>
  )
}

function ConfBox({ confLogoUrl, width }: { confLogoUrl: string; width: number }) {
  const logoWidth = Math.max(width - 40, 80)
  return (
    <div id="caa-box" style={{ ...SHELL, background: '#141515' }}>
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <Row width={width} height={189} justify="center" align="center" padding={20}>
          <div id="caa-logo">
            {confLogoUrl ? (
              <Image src={confLogoUrl} width={logoWidth} height={140} fit="contain" alt="" />
            ) : (
              <Rect fill="transparent" width={logoWidth} height={140} />
            )}
          </div>
        </Row>
      </div>
    </div>
  )
}

function TeamBox({
  isHome,
  team,
  logoScale,
}: {
  isHome: boolean
  team: TeamInfo | undefined
  logoScale: number
}) {
  const idPrefix = isHome ? 'home' : 'away'
  const logoUrl = team ? getTeamKnockoutLogo(team) : ''
  const school = team?.short_name.toUpperCase() ?? ''
  const mascot = team?.mascot.toUpperCase() ?? ''
  const clipWidth = logoBoxWidth(logoScale)

  return (
    <div
      id={`${idPrefix}-box`}
      style={{ ...SHELL, background: teamFill(team?.color) }}
    >
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <Flex
          width={teamBoxWidth(logoScale)}
          height={189}
          direction={isHome ? 'row-reverse' : 'row'}
          align="stretch"
        >
          <div id={`${idPrefix}-logo`}>
            {logoUrl ? (
              <CroppedImage
                src={logoUrl}
                width={clipWidth}
                height={MATCHUP_LOGO_HEIGHT}
                contentWidth={MATCHUP_LOGO_BASE_WIDTH}
                contentHeight={MATCHUP_LOGO_HEIGHT}
                fit="cover"
                scale={logoScale}
                alt=""
              />
            ) : (
              <Row width={clipWidth} height={MATCHUP_LOGO_HEIGHT} />
            )}
          </div>
          <Column
            width={MATCHUP_TEXT_WIDTH}
            height={189}
            justify="center"
            align={isHome ? 'start' : 'end'}
            paddingX={20}
          >
            <div id={`${idPrefix}-school-name`}>
              <Text
                color="#FFFFFF"
                fontSize={60}
                fontFamily={MATCHUP_FONT}
                textAlign={isHome ? 'left' : 'right'}
                lineHeight={1.05}
                singleLine
              >
                {school || ' '}
              </Text>
            </div>
            <div id={`${idPrefix}-team-name`}>
              <Text
                color="#FFFFFF"
                fontSize={72}
                fontFamily={MATCHUP_FONT}
                textAlign={isHome ? 'left' : 'right'}
                lineHeight={1.05}
                singleLine
              >
                {mascot || ' '}
              </Text>
            </div>
          </Column>
        </Flex>
      </div>
    </div>
  )
}

function BottomBar({ venue, location }: { venue: string; location: string }) {
  return (
    <div id="bottom-bar" style={{ ...SHELL, background: '#F0F0F0' }}>
      <ShapeSheen variant="light" />
      <div style={SHELL_CONTENT}>
        <Row width={1920} height={61} justify="center" align="center">
          <Text color="#000000" fontSize={48} fontFamily={MATCHUP_FONT} lineHeight={1.05} singleLine>
            {venueLine(venue, location)}
          </Text>
        </Row>
      </div>
    </div>
  )
}
