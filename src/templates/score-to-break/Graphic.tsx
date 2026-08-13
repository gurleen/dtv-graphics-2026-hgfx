import { HtmlCanvas } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import { scoreToBreakAnimation } from './animation'
import type { ScoreToBreakProps } from './schema'
import { STB_FONT, ScoreToBreakLayout } from './Layout'

function sponsorLogoUrl(props: ScoreToBreakProps): string {
  return props.sponsorLogoUrl || DEFAULT_SPONSOR_LOGO
}

export default function ScoreToBreakGraphic({
  props,
  onScreen,
}: TemplateRenderProps<ScoreToBreakProps>) {
  const { scope } = useGsapPlayout(onScreen, scoreToBreakAnimation)

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
        <div style={{ position: 'absolute', top: 650, left: 75 }}>
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
