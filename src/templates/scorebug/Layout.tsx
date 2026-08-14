import { type CSSProperties } from 'react'
import { Row, Column, Image } from '@hydra-tv/hydra-gfx-runtime'
import { formatClockDisplay } from '../../data/basketball'
import { getTeamKnockoutLogo, type TeamInfo } from '../../data/teams'
import { teamPlateBorderStyle } from '../shared/teamPlateBorder'

export const SCOREBUG_FONT = 'Zuume, system-ui, sans-serif'
export const SCOREBUG_CLOCK_FONT = '"DSEG7 Classic", Zuume, system-ui, sans-serif'
export const SCOREBUG_LOGO_SCALE = 1.8

export const TEAM_WIDTH = 247
export const INFO_WIDTH = 357
export const SCOREBUG_WIDTH = TEAM_WIDTH + INFO_WIDTH + TEAM_WIDTH
export const TEAM_HEIGHT = 80
export const SUB_HEIGHT = 35
export const SCOREBUG_HEIGHT = TEAM_HEIGHT + SUB_HEIGHT

const EMPTY_TEAM_FILL = '#141515'
const CHROME_FILL = '#141414'
const CLOCK_WELL = '#080808'
const CLOCK_LIT = '#FF6B00'
const CLOCK_UNLIT = 'rgba(255, 90, 0, 0.16)'
const CLOCK_GLOW =
  '0 0 4px #ff8a2a, 0 0 10px #ff5a00, 0 0 22px rgba(255, 80, 0, 0.7)'
const WATERMARK_WIDTH = 250

export type ScorebugLayoutProps = {
  homeTeam: TeamInfo | undefined
  awayTeam: TeamInfo | undefined
  homeScore: number
  awayScore: number
  clock: string
  shotClock: number
  period: string
  homeTimeouts: number
  awayTimeouts: number
  homeBonus: boolean
  awayBonus: boolean
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

function shotClockColor(shotClock: number): string {
  if (shotClock === 0) return 'transparent'
  if (shotClock <= 10) return '#EF4444'
  if (shotClock < 15) return '#EAB308'
  return '#FFFFFF'
}

export function ScorebugLayout({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  clock,
  shotClock,
  period,
  homeTimeouts,
  awayTimeouts,
  homeBonus,
  awayBonus,
  sponsorLogoUrl,
  homeLogoScale = SCOREBUG_LOGO_SCALE,
  awayLogoScale = SCOREBUG_LOGO_SCALE,
}: ScorebugLayoutProps) {
  return (
    <Column width={SCOREBUG_WIDTH} height="auto" align="stretch">
      <div
        style={{
          overflow: 'hidden',
          width: SCOREBUG_WIDTH,
          height: TEAM_HEIGHT,
        }}
      >
        <Row width={SCOREBUG_WIDTH} height={TEAM_HEIGHT} align="stretch" justify="start">
          <div style={{ overflow: 'hidden', width: TEAM_WIDTH, height: TEAM_HEIGHT }}>
            <TeamBox
              isHome={false}
              team={awayTeam}
              score={awayScore}
              logoScale={awayLogoScale}
            />
          </div>
          <div style={{ overflow: 'hidden', width: INFO_WIDTH, height: TEAM_HEIGHT }}>
            <InfoBox clock={clock} shotClock={shotClock} period={period} />
          </div>
          <div style={{ overflow: 'hidden', width: TEAM_WIDTH, height: TEAM_HEIGHT }}>
            <TeamBox
              isHome={true}
              team={homeTeam}
              score={homeScore}
              logoScale={homeLogoScale}
            />
          </div>
        </Row>
      </div>
      <div
        style={{
          overflow: 'hidden',
          width: SCOREBUG_WIDTH,
          height: SUB_HEIGHT,
        }}
      >
        <SubBar
          homeTimeouts={homeTimeouts}
          awayTimeouts={awayTimeouts}
          homeBonus={homeBonus}
          awayBonus={awayBonus}
          sponsorLogoUrl={sponsorLogoUrl}
        />
      </div>
    </Column>
  )
}

function TeamBox({
  isHome,
  team,
  score,
  logoScale,
}: {
  isHome: boolean
  team: TeamInfo | undefined
  score: number
  logoScale: number
}) {
  const idPrefix = isHome ? 'home' : 'away'
  const logoUrl = team ? getTeamKnockoutLogo(team) : ''
  const abbr = (team?.abbreviation ?? '').toUpperCase()
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
      {logoUrl ? (
        <TeamLogoLayer
          id={`${idPrefix}-logo`}
          src={logoUrl}
          isHome={isHome}
          scale={logoScale}
        />
      ) : null}
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <div
          style={{
            display: 'flex',
            flexDirection: isHome ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: TEAM_WIDTH,
            height: TEAM_HEIGHT,
            padding: '0 12px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 48,
              fontFamily: SCOREBUG_FONT,
              fontWeight: 800,
              letterSpacing: '0.08em',
              lineHeight: 1,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: TEAM_FOREGROUND_SHADOW.textShadow,
            }}
          >
            {abbr || ' '}
          </div>
          <div
            id={`${idPrefix}-score`}
            style={{
              color: '#FFFFFF',
              fontSize: 56,
              fontFamily: SCOREBUG_FONT,
              fontWeight: 800,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'center',
              textShadow: TEAM_FOREGROUND_SHADOW.textShadow,
            }}
          >
            {score}
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamLogoLayer({
  id,
  src,
  isHome,
  scale,
}: {
  id: string
  src: string
  isHome: boolean
  scale: number
}) {
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
        id={id}
        style={{
          position: 'absolute',
          top: -75,
          ...(isHome ? { right: -65 } : { left: -65 }),
          width: WATERMARK_WIDTH,
          opacity: 0.2,
          transform: `scale(${scale / SCOREBUG_LOGO_SCALE})`,
          transformOrigin: isHome ? 'top right' : 'top left',
        }}
      >
        <img src={src} alt="" style={{ width: WATERMARK_WIDTH, display: 'block' }} />
      </div>
    </div>
  )
}

function InfoBox({
  clock,
  shotClock,
  period,
}: {
  clock: string
  shotClock: number
  period: string
}) {
  const clockStr = formatClockDisplay(clock)
  const periodText = period.trim().toUpperCase() || ' '
  const shotVisible = shotClock > 0

  return (
    <div
      id="info-box"
      style={{
        ...SHELL,
        overflow: 'hidden',
        width: INFO_WIDTH,
        height: TEAM_HEIGHT,
        background: CHROME_FILL,
      }}
    >
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <Row
          width={INFO_WIDTH}
          height={TEAM_HEIGHT}
          align="center"
          justify="between"
          paddingX={6}
        >
          <InfoStat value={periodText} color="#FFFFFF" />
          <div
            id="clock-plate"
            style={{
              ...SHELL,
              width: 171,
              height: 68,
              flexShrink: 0,
              background: '#161616',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                ...SHELL,
                position: 'absolute',
                inset: 3,
                overflow: 'hidden',
                background: CLOCK_WELL,
                boxShadow:
                  'inset 0 8px 14px rgba(0,0,0,0.92), inset 0 -3px 6px rgba(0,0,0,0.55), inset 0 0 18px rgba(0,0,0,0.6)',
              }}
            >
              <ClockReadout value={clockStr} />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 2,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 16%, rgba(255,255,255,0.01) 40%, rgba(20,40,60,0.06) 72%, rgba(0,0,0,0.18) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
                }}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 3,
                  background:
                    'linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 22%, rgba(255,255,255,0) 42%)',
                }}
              />
            </div>
          </div>
          <InfoStat
            value={shotVisible ? String(shotClock) : ' '}
            color={shotClockColor(shotClock)}
            hidden={!shotVisible}
          />
        </Row>
      </div>
    </div>
  )
}

function InfoStat({
  value,
  color,
  hidden = false,
}: {
  value: string
  color: string
  hidden?: boolean
}) {
  return (
    <div
      style={{
        width: 87,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hidden ? 0 : 1,
      }}
    >
      <div
        style={{
          color,
          fontSize: 36,
          fontFamily: SCOREBUG_FONT,
          fontWeight: 800,
          letterSpacing: '0.04em',
          lineHeight: 1,
          textTransform: 'uppercase',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function unlitClockMask(clock: string): string {
  const source = clock.trim() || '0:00'
  return source.replace(/\d/g, '8')
}

function ClockReadout({ value }: { value: string }) {
  const lit = value.trim() || ' '
  const unlit = unlitClockMask(value)
  const type: CSSProperties = {
    fontSize: 34,
    fontFamily: SCOREBUG_CLOCK_FONT,
    fontWeight: 700,
    letterSpacing: '0.04em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }

  return (
    <div
      style={{
        ...SHELL_CONTENT,
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div aria-hidden style={{ ...type, color: CLOCK_UNLIT }}>
          {unlit}
        </div>
        <div
          style={{
            ...type,
            position: 'absolute',
            inset: 0,
            color: CLOCK_LIT,
            textShadow: CLOCK_GLOW,
          }}
        >
          {lit}
        </div>
      </div>
    </div>
  )
}

function SubBar({
  homeTimeouts,
  awayTimeouts,
  homeBonus,
  awayBonus,
  sponsorLogoUrl,
}: {
  homeTimeouts: number
  awayTimeouts: number
  homeBonus: boolean
  awayBonus: boolean
  sponsorLogoUrl: string
}) {
  return (
    <div
      id="sub-bar"
      style={{
        ...SHELL,
        width: SCOREBUG_WIDTH,
        height: SUB_HEIGHT,
        background: CHROME_FILL,
      }}
    >
      <ShapeSheen variant="dark" />
      <div style={SHELL_CONTENT}>
        <Row
          width={SCOREBUG_WIDTH}
          height={SUB_HEIGHT}
          align="center"
          justify="start"
        >
          <TeamSubBar isHome={false} timeouts={awayTimeouts} bonus={awayBonus} />
          <Row width={INFO_WIDTH} height={SUB_HEIGHT} align="center" justify="center">
            {sponsorLogoUrl ? (
              <Image src={sponsorLogoUrl} width={150} height={22} fit="contain" alt="" />
            ) : null}
          </Row>
          <TeamSubBar isHome={true} timeouts={homeTimeouts} bonus={homeBonus} />
        </Row>
      </div>
    </div>
  )
}

function TeamSubBar({
  isHome,
  timeouts,
  bonus,
}: {
  isHome: boolean
  timeouts: number
  bonus: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isHome ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: TEAM_WIDTH,
        height: SUB_HEIGHT,
        padding: '0 12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isHome ? 'row-reverse' : 'row',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <TimeoutPip active={timeouts > 0} />
        <TimeoutPip active={timeouts > 1} />
        <TimeoutPip active={timeouts > 2} />
        <TimeoutPip active={timeouts > 3} />
      </div>
      <div
        style={{
          color: '#FFFFFF',
          fontSize: 14,
          fontFamily: SCOREBUG_FONT,
          fontWeight: 800,
          letterSpacing: '0.08em',
          lineHeight: 1,
          textTransform: 'uppercase',
          opacity: bonus ? 1 : 0,
        }}
      >
        BONUS
      </div>
    </div>
  )
}

function TimeoutPip({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 25,
        height: 8,
        background: '#FFFFFF',
        opacity: active ? 1 : 0.2,
      }}
    />
  )
}
