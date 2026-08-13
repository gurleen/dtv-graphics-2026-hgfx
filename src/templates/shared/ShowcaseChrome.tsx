export const PLAYOUT_BTN = {
  padding: '8px 20px',
  fontWeight: 700,
  fontSize: 14,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
} as const

export function PlayoutButtons({
  onScreen,
  onIn,
  onOut,
}: {
  onScreen: boolean
  onIn: () => void
  onOut: () => void
}) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <button
        type="button"
        onClick={onIn}
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
        onClick={onOut}
        style={{
          ...PLAYOUT_BTN,
          color: !onScreen ? '#111' : '#f5f5f5',
          background: !onScreen ? '#e07070' : '#333',
        }}
      >
        OUT
      </button>
    </div>
  )
}
