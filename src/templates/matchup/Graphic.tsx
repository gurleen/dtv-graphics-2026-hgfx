import { HtmlCanvas } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { useGsapPlayout } from '../../lib/gsap'
import type { Sport } from '../../config'
import { findTeam } from '../../data/teams'
import { matchupAnimation } from './animation'
import type { MatchupProps } from './schema'
import { DEFAULT_SPONSOR_LOGO } from './assets'
import { MATCHUP_FONT, MatchupLayout } from './Layout'

function presenterForSport(sport: Sport): string {
  return sport === 'wrestling'
    ? 'DREXEL WRESTLING PRESENTED BY'
    : 'DREXEL BASKETBALL PRESENTED BY'
}

function sponsorLogoUrl(props: MatchupProps): string {
  return props.sponsorLogoUrl || DEFAULT_SPONSOR_LOGO
}

export default function MatchupGraphic({
  props,
  onScreen,
}: TemplateRenderProps<MatchupProps>) {
  const { scope } = useGsapPlayout(onScreen, matchupAnimation)

  const homeTeam = findTeam(props.homeTeamId)
  const awayTeam = findTeam(props.awayTeamId)
  const sponsorLogo = sponsorLogoUrl(props)
  const presenter = presenterForSport(props.sport)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: MATCHUP_FONT }}
      >
        {/*
          Absolute top (not marginTop): margin-top collapses through HtmlCanvas
          into the host PVW scale wrapper and pushes the graphic below the
          overflow:hidden monitor well — preview looks empty/black.
        */}
        <div style={{ position: 'absolute', top: 700, left: 0, width: 1920 }}>
          <MatchupLayout
            presenter={presenter}
            sponsorLogoUrl={sponsorLogo}
            venue={props.venue}
            location={props.location}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeLogoScale={props.homeLogoScale}
            awayLogoScale={props.awayLogoScale}
          />
        </div>
      </div>
    </HtmlCanvas>
  )
}
