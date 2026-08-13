import { type CSSProperties } from 'react'
import { Row, Column, Image } from '@hydra-tv/hydra-gfx-runtime'
import { CroppedImage } from '../../components/CroppedImage'
import { getTeamKnockoutLogo, type TeamInfo } from '../../data/teams'
import { teamPlateBorderStyle } from '../shared/teamPlateBorder'

export const STB_FONT = 'Zuume, system-ui, sans-serif'
export const STB_LOGO_SCALE = 1.8
export const STB_LOGO_BASE_WIDTH = 300
export const STB_LOGO_CONTENT_HEIGHT = 189

const TEAM_WIDTH = 183
const TEAM_HEIGHT = 168
const SCORE_WIDTH = 254
const ROW_WIDTH = TEAM_WIDTH + SCORE_WIDTH
const FOOTER_HEIGHT = 37
const EMPTY_TEAM_FILL = '#141515'
const SCORE_FILL = '#141414'
const TICKER_FONT_SIZE = Math.round(TEAM_HEIGHT * 0.95)
const TICKER_REPEAT = 8
const TICKER_CSS = `
@keyframes stb-ticker-out-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes stb-ticker-out-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
.stb-ticker {
  display: flex;
  width: max-content;
  height: 100%;
  align-items: center;
}
.stb-ticker-out-left {
  animation: stb-ticker-out-left 18s linear infinite;
}
.stb-ticker-out-right {
  animation: stb-ticker-out-right 18s linear infinite;
}
`

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
const TEAM_FOREGROUND_SHADOW: CSSProperties = {
  textShadow: '0 1px 6px rgba(0,0,0,0.55)',
  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.45))',
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
    <Column width={ROW_WIDTH} height="auto" align="stretch">
      <style>{TICKER_CSS}</style>
      <div style={{ overflow: 'hidden', width: ROW_WIDTH, height: TEAM_HEIGHT }}>
        <div id="away-row" style={{ width: ROW_WIDTH, height: TEAM_HEIGHT }}>
          <Row width={ROW_WIDTH} height={TEAM_HEIGHT} align="stretch" justify="start">
            <TeamBox isHome={false} team={awayTeam} logoScale={awayLogoScale} />
            <ScoreBox score={awayScore} isHome={false} />
          </Row>
        </div>
      </div>
      <div style={{ overflow: 'hidden', width: ROW_WIDTH, height: TEAM_HEIGHT }}>
        <div id="home-row" style={{ width: ROW_WIDTH, height: TEAM_HEIGHT }}>
          <Row width={ROW_WIDTH} height={TEAM_HEIGHT} align="stretch" justify="start">
            <TeamBox isHome={true} team={homeTeam} logoScale={homeLogoScale} />
            <ScoreBox score={homeScore} isHome={true} />
          </Row>
        </div>
      </div>
      <div style={{ overflow: 'hidden', width: ROW_WIDTH, height: FOOTER_HEIGHT }}>
        <BottomBar periodText={period} sponsorLogoUrl={sponsorLogoUrl} />
      </div>
    </Column>
  )
}

function TickerCopy({ mascot }: { mascot: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        whiteSpace: 'nowrap',
        fontFamily: STB_FONT,
        fontWeight: 800,
        fontSize: TICKER_FONT_SIZE,
        lineHeight: 1,
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.08)',
      }}
    >
      {Array.from({ length: TICKER_REPEAT }, (_, i) => (
        <span key={i} style={{ paddingRight: '0.6em' }}>
          {mascot}
          {' \u2022 '}
        </span>
      ))}
    </div>
  )
}

function MascotTicker({ mascot, isHome }: { mascot: string; isHome: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        className={
          isHome ? 'stb-ticker stb-ticker-out-right' : 'stb-ticker stb-ticker-out-left'
        }
      >
        <TickerCopy mascot={mascot} />
        <TickerCopy mascot={mascot} />
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
  const mascot = team?.mascot.toUpperCase() ?? ''
  const fill = teamFill(team?.color)

  return (
    <div
      id={`${idPrefix}-box`}
      style={{
        ...SHELL,
        ...teamPlateBorderStyle(fill),
        overflow: 'hidden',
        width: TEAM_WIDTH,
        height: TEAM_HEIGHT,
        background: fill,
      }}
    >
      {mascot ? <MascotTicker mascot={mascot} isHome={isHome} /> : null}
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <div id={`${idPrefix}-logo`} style={{ filter: TEAM_FOREGROUND_SHADOW.filter }}>
          {logoUrl ? (
            <CroppedImage
              src={logoUrl}
              width={TEAM_WIDTH}
              height={TEAM_HEIGHT}
              contentWidth={STB_LOGO_BASE_WIDTH}
              contentHeight={STB_LOGO_CONTENT_HEIGHT}
              fit="cover"
              scale={logoScale}
              alt=""
            />
          ) : (
            <Row width={TEAM_WIDTH} height={TEAM_HEIGHT} />
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreBox({ score, isHome }: { score: number; isHome: boolean }) {
  const textId = isHome ? 'home-score' : 'away-score'

  return (
    <div
      style={{
        ...SHELL,
        overflow: 'hidden',
        width: SCORE_WIDTH,
        height: TEAM_HEIGHT,
        background: SCORE_FILL,
      }}
    >
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <div
          id={textId}
          style={{
            width: SCORE_WIDTH,
            height: TEAM_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: 120,
            fontFamily: STB_FONT,
            fontWeight: 800,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textShadow: TEAM_FOREGROUND_SHADOW.textShadow,
          }}
        >
          {score}
        </div>
      </div>
    </div>
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
    <div id="bottom-bar" style={{ ...SHELL, background: '#F0F0F0' }}>
      <ShapeSheen variant="light" />
      <div style={SHELL_CONTENT}>
        <Row
          width={ROW_WIDTH}
          height={FOOTER_HEIGHT}
          justify="between"
          align="center"
          paddingX={8}
        >
          <Row width={150} height={FOOTER_HEIGHT} align="center" justify="start">
            {sponsorLogoUrl ? (
              <Image src={sponsorLogoUrl} width={150} height={28} fit="contain" alt="" />
            ) : null}
          </Row>
          <div
            style={{
              color: '#000000',
              fontSize: 22,
              fontFamily: STB_FONT,
              fontWeight: 800,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {periodText.toUpperCase() || ' '}
          </div>
        </Row>
      </div>
    </div>
  )
}
