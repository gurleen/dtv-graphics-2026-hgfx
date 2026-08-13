import type { CSSProperties } from 'react'

const SHEEN_DARK: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 28%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.22) 100%)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.28)',
}

const SHEEN_LIGHT: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  background:
    'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.02) 32%, rgba(20,40,60,0.06) 100%)',
  boxShadow:
    'inset 0 1px 0 rgba(0,0,0,0.12), inset 0 -1px 0 rgba(255,255,255,0.35)',
}

export const SHELL: CSSProperties = { position: 'relative' }
export const SHELL_CONTENT: CSSProperties = { position: 'relative', zIndex: 1 }

export function ShapeSheen({ variant }: { variant: 'dark' | 'light' }) {
  return <div aria-hidden style={variant === 'light' ? SHEEN_LIGHT : SHEEN_DARK} />
}
