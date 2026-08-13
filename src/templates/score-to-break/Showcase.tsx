import { useState } from 'react'
import { useGsapPlayout } from '../../lib/gsap'
import { findTeam } from '../../data/teams'
import { DEFAULT_SPONSOR_LOGO } from '../matchup/assets'
import { STB_FONT, STB_LOGO_SCALE, ScoreToBreakLayout } from './Layout'
import { scoreToBreakAnimation } from './animation'
import { PlayoutSwitch, ShowcaseStage } from '../shared/ShowcaseChrome'
import {
  SHOWCASE_AWAY_TEAM_ID,
  SHOWCASE_HOME_TEAM_ID,
} from '../shared/showcaseSample'

const STB_WIDTH = 437
const STB_HEIGHT = 168 + 168 + 37

export default function ScoreToBreakShowcase({
  autoIn = false,
  homeLogoScale = STB_LOGO_SCALE,
  awayLogoScale = STB_LOGO_SCALE,
}: {
  autoIn?: boolean
  homeLogoScale?: number
  awayLogoScale?: number
}) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const { scope, isAnimating } = useGsapPlayout(
    onScreen,
    scoreToBreakAnimation,
    [homeLogoScale, awayLogoScale],
  )

  const homeTeam = findTeam(SHOWCASE_HOME_TEAM_ID)
  const awayTeam = findTeam(SHOWCASE_AWAY_TEAM_ID)

  return (
    <div>
      <PlayoutSwitch
        onScreen={onScreen}
        onChange={setOnScreen}
        disabled={isAnimating}
      />
      <ShowcaseStage
        width={STB_WIDTH}
        height={STB_HEIGHT}
        style={{ overflow: 'hidden', background: '#000' }}
      >
        <div
          ref={scope}
          style={{
            width: STB_WIDTH,
            height: STB_HEIGHT,
            fontFamily: STB_FONT,
          }}
        >
          <ScoreToBreakLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={72}
            awayScore={68}
            period="1ST QUARTER"
            sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
            homeLogoScale={homeLogoScale}
            awayLogoScale={awayLogoScale}
          />
        </div>
      </ShowcaseStage>
    </div>
  )
}
