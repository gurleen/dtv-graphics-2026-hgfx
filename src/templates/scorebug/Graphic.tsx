import { HtmlCanvas } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import { scorebugAnimation } from './animation'
import type { ScorebugProps } from './schema'
import { SCOREBUG_FONT, SCOREBUG_WIDTH, ScorebugLayout } from './Layout'

function sponsorLogoUrl(props: ScorebugProps): string {
  return props.sponsorLogoUrl || DEFAULT_SPONSOR_LOGO
}

export default function ScorebugGraphic({
  props,
  onScreen,
}: TemplateRenderProps<ScorebugProps>) {
  const { scope } = useGsapPlayout(onScreen, scorebugAnimation)

  const homeTeam = findTeam(props.homeTeamId)
  const awayTeam = findTeam(props.awayTeamId)
  const sponsorLogo = sponsorLogoUrl(props)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: SCOREBUG_FONT }}
      >
        <div
          style={{
            position: 'absolute',
            top: 930,
            left: Math.round((1920 - SCOREBUG_WIDTH) / 2),
          }}
        >
          <ScorebugLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={props.homeScore}
            awayScore={props.awayScore}
            clock={props.clock}
            shotClock={props.shotClock}
            period={props.period}
            homeTimeouts={props.homeTimeouts}
            awayTimeouts={props.awayTimeouts}
            homeBonus={props.homeBonus}
            awayBonus={props.awayBonus}
            sponsorLogoUrl={sponsorLogo}
            homeLogoScale={props.homeLogoScale}
            awayLogoScale={props.awayLogoScale}
          />
        </div>
      </div>
    </HtmlCanvas>
  )
}
