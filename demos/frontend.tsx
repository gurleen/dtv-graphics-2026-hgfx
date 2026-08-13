import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useGsapPlayout } from '../src/lib/gsap'
import { DREXEL_TEAM_ID, findTeam, type TeamInfo } from '../src/data/teams'
import { matchupAnimation } from '../src/templates/matchup/animation'
import { DEFAULT_SPONSOR_LOGO } from '../src/templates/matchup/assets'
import {
  MATCHUP_FONT,
  MATCHUP_LOGO_SCALE,
  MatchupLayout,
} from '../src/templates/matchup/Layout'
import { matchupDefaults } from '../src/templates/matchup/schema'
import {
  STB_FONT,
  STB_LOGO_SCALE,
  ScoreToBreakLayout,
} from '../src/templates/score-to-break/Layout'

const DELAWARE_TEAM_ID = 48
const MATCHUP_PREVIEW_SCALE = 0.55
const MATCHUP_WIDTH = 1920
const MATCHUP_HEIGHT = 72 + 189 + 61
const MATCHUP_HEADROOM = 140

function ScaleSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div style={{ maxWidth: 480, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        {label}: {value.toFixed(2)}
      </div>
      <input
        type="range"
        min={0.8}
        max={2.5}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  )
}

const PLAYOUT_BTN = {
  padding: '8px 20px',
  fontWeight: 700,
  fontSize: 14,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
} as const

function MatchupPreview({
  homeTeam,
  awayTeam,
  homeLogoScale,
  awayLogoScale,
}: {
  homeTeam: TeamInfo | undefined
  awayTeam: TeamInfo | undefined
  homeLogoScale: number
  awayLogoScale: number
}) {
  const [onScreen, setOnScreen] = useState(false)
  const scope = useGsapPlayout(onScreen, matchupAnimation, [
    homeLogoScale,
    awayLogoScale,
  ])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setOnScreen(true)}
          style={{
            ...PLAYOUT_BTN,
            color: onScreen ? '#111' : '#f5f5f5',
            background: onScreen ? '#7dce82' : '#333',
          }}
        >
          IN
        </button>
        <button
          type="button"
          onClick={() => setOnScreen(false)}
          style={{
            ...PLAYOUT_BTN,
            color: !onScreen ? '#111' : '#f5f5f5',
            background: !onScreen ? '#e07070' : '#333',
          }}
        >
          OUT
        </button>
      </div>
      <div
        style={{
          width: MATCHUP_WIDTH * MATCHUP_PREVIEW_SCALE,
          height: (MATCHUP_HEIGHT + MATCHUP_HEADROOM) * MATCHUP_PREVIEW_SCALE,
          overflow: 'hidden',
          background: '#000',
        }}
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
      </div>
    </div>
  )
}

function Demo() {
  const [matchupHomeScale, setMatchupHomeScale] = useState(MATCHUP_LOGO_SCALE)
  const [matchupAwayScale, setMatchupAwayScale] = useState(MATCHUP_LOGO_SCALE)
  const [stbHomeScale, setStbHomeScale] = useState(STB_LOGO_SCALE)
  const [stbAwayScale, setStbAwayScale] = useState(STB_LOGO_SCALE)

  const homeTeam = findTeam(DREXEL_TEAM_ID)
  const awayTeam = findTeam(DELAWARE_TEAM_ID)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
        padding: 40,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
        Matchup intro
      </h1>
      <p style={{ color: '#9aa0a6', margin: '0 0 40px', maxWidth: 720, lineHeight: 1.5 }}>
        CAA wordmark draws in with a glow, then slams into the conference box.
        Use IN / OUT to take the graphic. Logo-scale sliders still widen the team
        clip boxes. Score to break is a static layout preview.
      </p>

      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Matchup</h2>
        <ScaleSlider
          label="homeLogoScale"
          value={matchupHomeScale}
          onChange={setMatchupHomeScale}
        />
        <ScaleSlider
          label="awayLogoScale"
          value={matchupAwayScale}
          onChange={setMatchupAwayScale}
        />
        <MatchupPreview
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeLogoScale={matchupHomeScale}
          awayLogoScale={matchupAwayScale}
        />
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Score to break</h2>
        <ScaleSlider
          label="homeLogoScale"
          value={stbHomeScale}
          onChange={setStbHomeScale}
        />
        <ScaleSlider
          label="awayLogoScale"
          value={stbAwayScale}
          onChange={setStbAwayScale}
        />
        <div style={{ fontFamily: STB_FONT }}>
          <ScoreToBreakLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={72}
            awayScore={68}
            period="1ST QUARTER"
            sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
            homeLogoScale={stbHomeScale}
            awayLogoScale={stbAwayScale}
          />
        </div>
      </section>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<Demo />)
