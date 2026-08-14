import { useState } from 'react'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import {
  SCOREBUG_FONT,
  SCOREBUG_HEIGHT,
  SCOREBUG_LOGO_SCALE,
  SCOREBUG_WIDTH,
  ScorebugLayout,
} from './Layout'
import { scorebugAnimation } from './animation'
import { PlayoutSwitch, ShowcaseStage } from '../shared/ShowcaseChrome'
import {
  SHOWCASE_AWAY_TEAM_ID,
  SHOWCASE_HOME_TEAM_ID,
} from '../shared/showcaseSample'

export default function ScorebugShowcase({
  autoIn = false,
  awayTeamId = SHOWCASE_AWAY_TEAM_ID,
  homeLogoScale = SCOREBUG_LOGO_SCALE,
  awayLogoScale = SCOREBUG_LOGO_SCALE,
}: {
  autoIn?: boolean
  awayTeamId?: number
  homeLogoScale?: number
  awayLogoScale?: number
}) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const { scope, isAnimating } = useGsapPlayout(onScreen, scorebugAnimation, [
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
        width={SCOREBUG_WIDTH}
        height={SCOREBUG_HEIGHT}
        style={{ overflow: 'hidden', background: '#000' }}
      >
        <div
          ref={scope}
          style={{
            width: SCOREBUG_WIDTH,
            height: SCOREBUG_HEIGHT,
            fontFamily: SCOREBUG_FONT,
          }}
        >
          <ScorebugLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={72}
            awayScore={68}
            clock="12:34"
            shotClock={24}
            period="2ND"
            homeTimeouts={3}
            awayTimeouts={4}
            homeBonus={true}
            awayBonus={false}
            sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
            homeLogoScale={homeLogoScale}
            awayLogoScale={awayLogoScale}
          />
        </div>
      </ShowcaseStage>
    </div>
  )
}
