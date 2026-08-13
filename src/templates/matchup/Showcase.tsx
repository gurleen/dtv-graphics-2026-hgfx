import { useState } from 'react'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from './assets'
import {
  MATCHUP_FONT,
  MATCHUP_LOGO_SCALE,
  MatchupLayout,
} from './Layout'
import { matchupAnimation } from './animation'
import { matchupDefaults } from './schema'
import { PlayoutSwitch, ShowcaseStage } from '../shared/ShowcaseChrome'
import {
  SHOWCASE_AWAY_TEAM_ID,
  SHOWCASE_HOME_TEAM_ID,
} from '../shared/showcaseSample'

const MATCHUP_PREVIEW_SCALE = 0.55
const MATCHUP_WIDTH = 1920
const MATCHUP_HEIGHT = 72 + 189 + 61
const MATCHUP_HEADROOM = 140

export default function MatchupShowcase({
  autoIn = false,
  awayTeamId = SHOWCASE_AWAY_TEAM_ID,
  homeLogoScale = MATCHUP_LOGO_SCALE,
  awayLogoScale = MATCHUP_LOGO_SCALE,
}: {
  autoIn?: boolean
  awayTeamId?: number
  homeLogoScale?: number
  awayLogoScale?: number
}) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const { scope, isAnimating } = useGsapPlayout(onScreen, matchupAnimation, [
    homeLogoScale,
    awayLogoScale,
  ])

  const homeTeam = findTeam(SHOWCASE_HOME_TEAM_ID)
  const awayTeam = findTeam(awayTeamId)

  return (
    <div>
      <PlayoutSwitch
        onScreen={onScreen}
        onChange={setOnScreen}
        disabled={isAnimating}
      />
      <ShowcaseStage
        width={MATCHUP_WIDTH * MATCHUP_PREVIEW_SCALE}
        height={(MATCHUP_HEIGHT + MATCHUP_HEADROOM) * MATCHUP_PREVIEW_SCALE}
        style={{ overflow: 'hidden', background: '#000' }}
      >
        <div
          ref={scope}
          style={{
            width: MATCHUP_WIDTH,
            height: MATCHUP_HEIGHT + MATCHUP_HEADROOM,
            transform: `scale(${MATCHUP_PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            fontFamily: MATCHUP_FONT,
            paddingTop: MATCHUP_HEADROOM,
          }}
        >
          <MatchupLayout
            presenter="DREXEL BASKETBALL PRESENTED BY"
            sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
            venue={matchupDefaults.venue}
            location={matchupDefaults.location}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeLogoScale={homeLogoScale}
            awayLogoScale={awayLogoScale}
          />
        </div>
      </ShowcaseStage>
    </div>
  )
}
