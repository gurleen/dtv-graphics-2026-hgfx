import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CroppedImage } from '../src/components/CroppedImage'

const BOX = 240

const DEMO_SRC =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="200" height="200" fill="#e74c3c"/>
    <rect x="200" width="200" height="200" fill="#3498db"/>
    <rect y="200" width="200" height="200" fill="#2ecc71"/>
    <rect x="200" y="200" width="200" height="200" fill="#f1c40f"/>
    <circle cx="200" cy="200" r="56" fill="#111"/>
    <text x="200" y="208" text-anchor="middle" fill="#fff" font-size="22" font-family="system-ui,sans-serif">CENTER</text>
    <text x="100" y="108" text-anchor="middle" fill="#fff" font-size="28" font-family="system-ui,sans-serif">NW</text>
    <text x="300" y="108" text-anchor="middle" fill="#fff" font-size="28" font-family="system-ui,sans-serif">NE</text>
    <text x="100" y="308" text-anchor="middle" fill="#fff" font-size="28" font-family="system-ui,sans-serif">SW</text>
    <text x="300" y="308" text-anchor="middle" fill="#fff" font-size="28" font-family="system-ui,sans-serif">SE</text>
  </svg>`)

function Example({
  label,
  note,
  scale,
}: {
  label: string
  note: string
  scale?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div
        style={{
          outline: '2px dashed #ff4d6d',
          outlineOffset: 0,
        }}
      >
        <CroppedImage src={DEMO_SRC} width={BOX} height={BOX} scale={scale} alt="quadrant demo" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{label}</div>
        <div style={{ color: '#9aa0a6', fontSize: 13, marginTop: 4 }}>{note}</div>
      </div>
    </div>
  )
}

function Demo() {
  const [liveScale, setLiveScale] = useState(1.5)

  return (
    <div
      style={{
        minHeight: '100vh',
        margin: 0,
        background: '#111',
        color: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
        padding: 40,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>CroppedImage</h1>
      <p style={{ color: '#9aa0a6', margin: '0 0 36px', maxWidth: 720, lineHeight: 1.5 }}>
        Invisible overflow-hidden box with a centered, scaled image. The dashed outline is
        demo-only so you can see the clip bounds — the component itself has no chrome.
      </p>

      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 48 }}>
        <Example label="scale={1}" note="Full image fits; nothing clipped" scale={1} />
        <Example label="scale={1.5} (default)" note="Edges overrun and are cut off" />
        <Example label="scale={2.5}" note="Tight crop; mostly CENTER remains" scale={2.5} />
      </div>

      <div style={{ maxWidth: 480 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Live scale: {liveScale.toFixed(2)}</div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={liveScale}
          onChange={(e) => setLiveScale(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <div
          style={{
            outline: '2px dashed #ff4d6d',
            width: BOX,
            height: BOX,
          }}
        >
          <CroppedImage src={DEMO_SRC} width={BOX} height={BOX} scale={liveScale} alt="live scale" />
        </div>
      </div>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<Demo />)
