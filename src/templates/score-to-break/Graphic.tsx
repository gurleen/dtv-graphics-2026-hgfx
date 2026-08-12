import { HtmlCanvas, Row, Column, Image } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../lib/gsap'
import {
  findTeam,
  getTeamKnockoutLogo,
  type TeamInfo,
} from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import type { ScoreToBreakProps } from './schema'

const STB_FONT = 'Zuume, system-ui, sans-serif'
const EMPTY_TEAM_FILL = '#141515'
const PANEL_BG = '#131313'
const BOTTOM_BAR_BG = '#D3D1D1'

function animation(timeline: gsap.core.Timeline, root: HTMLElement) {
  timeline
    .from('#score-to-break', { x: -100, opacity: 0, duration: 1, ease: 'power3.out' })
    .from('#home-score', { x: 100, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.7')
    .from('#away-score', { x: -100, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.8')
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'power3.out' })
}

function teamFill(color: string | undefined): string {
  if (!color) return EMPTY_TEAM_FILL
  return color.startsWith('#') ? color : `#${color}`
}

function sponsorLogoUrl(props: ScoreToBreakProps): string {
  return props.sponsorLogoUrl || DEFAULT_SPONSOR_LOGO
}

export default function ScoreToBreakGraphic({
  props,
  onScreen,
}: TemplateRenderProps<ScoreToBreakProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  const homeTeam = findTeam(props.homeTeamId)
  const awayTeam = findTeam(props.awayTeamId)
  const sponsorLogo = sponsorLogoUrl(props)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: STB_FONT }}
      >
        {/*
          Absolute positioning: margin/padding on the canvas collapses into the
          host PVW scale wrapper and can push the graphic out of the monitor well.
        */}
        <div
          id="score-to-break"
          style={{ position: 'absolute', top: 650, left: 75 }}
        >
          <Column width={437} height={373} align="stretch" background={PANEL_BG}>
            <Row width={437} height={168} align="stretch" justify="start">
              <TeamBox team={awayTeam} />
              <ScoreBox score={props.awayScore} isHome={false} />
            </Row>
            <Row width={437} height={168} align="stretch" justify="start">
              <TeamBox team={homeTeam} />
              <ScoreBox score={props.homeScore} isHome={true} />
            </Row>
            <BottomBar periodText={props.period} sponsorLogoUrl={sponsorLogo} />
          </Column>
        </div>
      </div>
    </HtmlCanvas>
  )
}

function TeamBox({ team }: { team: TeamInfo | undefined }) {
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
        <img
          src={logoUrl}
          alt=""
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
          }}
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
