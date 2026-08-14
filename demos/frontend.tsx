import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MATCHUP_LOGO_SCALE } from '../src/templates/matchup/Layout'
import MatchupShowcase from '../src/templates/matchup/Showcase'
import { SCOREBUG_LOGO_SCALE } from '../src/templates/scorebug/Layout'
import ScorebugShowcase from '../src/templates/scorebug/Showcase'
import { STB_LOGO_SCALE } from '../src/templates/score-to-break/Layout'
import ScoreToBreakShowcase from '../src/templates/score-to-break/Showcase'
import TalentSingleShowcase from '../src/templates/talent/single/Showcase'
import TalentDoubleShowcase from '../src/templates/talent/double/Showcase'

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
  const [matchupHomeScale, setMatchupHomeScale] = useState(MATCHUP_LOGO_SCALE)
  const [matchupAwayScale, setMatchupAwayScale] = useState(MATCHUP_LOGO_SCALE)
  const [stbHomeScale, setStbHomeScale] = useState(STB_LOGO_SCALE)
  const [stbAwayScale, setStbAwayScale] = useState(STB_LOGO_SCALE)
  const [scorebugHomeScale, setScorebugHomeScale] = useState(SCOREBUG_LOGO_SCALE)
  const [scorebugAwayScale, setScorebugAwayScale] = useState(SCOREBUG_LOGO_SCALE)

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
        DTV 2026 graphics
      </h1>
      <p style={{ color: '#9aa0a6', margin: '0 0 40px', maxWidth: 720, lineHeight: 1.5 }}>
        CAA wordmark draws in with a glow, then slams into the conference box.
        The basketball scorebug slides in from the sides with clock chrome in
        the middle. Score to break rows slam from the center, then logos and
        scores slide in. Talent panels use clipped plate motion with sheen on
        every plate. Use the IN / OUT switch to take any graphic.
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
        <MatchupShowcase
          homeLogoScale={matchupHomeScale}
          awayLogoScale={matchupAwayScale}
        />
      </section>

      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
          Basketball scorebug
        </h2>
        <ScaleSlider
          label="homeLogoScale"
          value={scorebugHomeScale}
          onChange={setScorebugHomeScale}
        />
        <ScaleSlider
          label="awayLogoScale"
          value={scorebugAwayScale}
          onChange={setScorebugAwayScale}
        />
        <ScorebugShowcase
          homeLogoScale={scorebugHomeScale}
          awayLogoScale={scorebugAwayScale}
        />
      </section>

      <section style={{ marginBottom: 56 }}>
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
        <ScoreToBreakShowcase
          homeLogoScale={stbHomeScale}
          awayLogoScale={stbAwayScale}
        />
      </section>

      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
          Talent lower third (single)
        </h2>
        <TalentSingleShowcase />
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
          Talent lower third (double)
        </h2>
        <TalentDoubleShowcase />
      </section>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<Demo />)
