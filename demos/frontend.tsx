import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DREXEL_TEAM_ID, findTeam } from '../src/data/teams'
import {
  DEFAULT_BASKETBALL_CONF_LOGO,
  DEFAULT_SPONSOR_LOGO,
} from '../src/templates/matchup/assets'
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

function Demo() {
  const [matchupScale, setMatchupScale] = useState(MATCHUP_LOGO_SCALE)
  const [stbScale, setStbScale] = useState(STB_LOGO_SCALE)

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
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Logo crop scales</h1>
      <p style={{ color: '#9aa0a6', margin: '0 0 40px', maxWidth: 720, lineHeight: 1.5 }}>
        Same layouts as the on-air graphics, no animation. Matchup clip box widens with
        scale so the logo stays full-width (top/bottom crop only). Score to break fills
        the team color box.
      </p>

      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Matchup</h2>
        <ScaleSlider label="logoScale" value={matchupScale} onChange={setMatchupScale} />
        <div
          style={{
            width: MATCHUP_WIDTH * MATCHUP_PREVIEW_SCALE,
            height: MATCHUP_HEIGHT * MATCHUP_PREVIEW_SCALE,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: MATCHUP_WIDTH,
              height: MATCHUP_HEIGHT,
              transform: `scale(${MATCHUP_PREVIEW_SCALE})`,
              transformOrigin: 'top left',
              fontFamily: MATCHUP_FONT,
            }}
          >
            <MatchupLayout
              presenter="DREXEL BASKETBALL PRESENTED BY"
              sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
              confLogoUrl={DEFAULT_BASKETBALL_CONF_LOGO}
              venue={matchupDefaults.venue}
              location={matchupDefaults.location}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              logoScale={matchupScale}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Score to break</h2>
        <ScaleSlider label="logoScale" value={stbScale} onChange={setStbScale} />
        <div style={{ fontFamily: STB_FONT }}>
          <ScoreToBreakLayout
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeScore={72}
            awayScore={68}
            period="1ST QUARTER"
            sponsorLogoUrl={DEFAULT_SPONSOR_LOGO}
            logoScale={stbScale}
          />
        </div>
      </section>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<Demo />)
