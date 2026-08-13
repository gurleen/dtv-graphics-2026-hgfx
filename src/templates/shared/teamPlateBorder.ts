import type { CSSProperties } from 'react'

/** Mix amount: about a shade or two off the fill. */
const MIX = 0.15
/** Below this, mix toward white; at or above, mix toward black. */
const LUM_FLIP = 0.35

function parseHex(color: string): [number, number, number] | null {
  const raw = color.trim().replace(/^#/, '')
  let hex = raw
  if (raw.length === 3) {
    hex = raw
      .split('')
      .map((c) => c + c)
      .join('')
  } else if (raw.length === 8) {
    hex = raw.slice(0, 6)
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ]
}

function channelLin(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * channelLin(r) + 0.7152 * channelLin(g) + 0.0722 * channelLin(b)
}

function mixChannel(from: number, toward: number, t: number): number {
  return Math.round(from + (toward - from) * t)
}

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

/**
 * Related-hue hairline for a team-color plate. Mixes `fill` toward white when
 * the plate is dark, toward black when it is bright. Do not use `alternate_color`.
 */
export function teamPlateBorderColor(fill: string): string {
  const rgb = parseHex(fill)
  if (!rgb) return '#2a2a2a'
  const [r, g, b] = rgb
  const towardWhite = relativeLuminance(r, g, b) < LUM_FLIP
  const tr = towardWhite ? 255 : 0
  return toHex(
    mixChannel(r, tr, MIX),
    mixChannel(g, tr, MIX),
    mixChannel(b, tr, MIX),
  )
}

/** 1px outline that does not grow the plate geometry. */
export function teamPlateBorderStyle(fill: string): CSSProperties {
  return {
    boxSizing: 'border-box',
    border: `1px solid ${teamPlateBorderColor(fill)}`,
  }
}
