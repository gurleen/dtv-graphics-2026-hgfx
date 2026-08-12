import { HtmlCanvas } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import type { ScoreToBreakProps } from './schema'
import { STB_FONT, ScoreToBreakLayout } from './Layout'

function animation(timeline: gsap.core.Timeline, root: HTMLElement) {
  timeline
    .from('#score-to-break', { x: -100, opacity: 0, duration: 1, ease: 'power3.out' })
    .from('#home-score', { x: 100, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.7')
    .from('#away-score', { x: -100, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.8')
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'power3.out' })
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
          <ScoreToBreakLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={props.homeScore}
            awayScore={props.awayScore}
            period={props.period}
            sponsorLogoUrl={sponsorLogo}
            homeLogoScale={props.homeLogoScale}
            awayLogoScale={props.awayLogoScale}
          />
        </div>
      </div>
    </HtmlCanvas>
  )
}
