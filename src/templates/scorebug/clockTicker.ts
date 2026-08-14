import { useSyncExternalStore } from 'react'
import { basketballGameDefaults } from '../../data/basketball'

export type ScorebugClockState = {
  running: boolean
  clock: string
  shotClock: number
}

export type ScorebugClockTick = {
  clock: string
  shotClock: number
}

type Listener = () => void
type ClockSink = (tick: ScorebugClockTick) => void

/** Parse `M:SS`, `MM:SS`, `M:SS.t`, or a bare seconds/tenths string. */
export function clockToSeconds(clock: string): number {
  const trimmed = clock.trim()
  if (trimmed.includes(':')) {
    const [minPart, secPart] = trimmed.split(':')
    const minutes = Number.parseInt(minPart, 10)
    const seconds = Number.parseFloat(secPart)
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0
    return Math.max(0, minutes * 60 + seconds)
  }
  const seconds = Number.parseFloat(trimmed)
  return Number.isFinite(seconds) ? Math.max(0, seconds) : 0
}

export function secondsToClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function numericValue(value: number | string): number {
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(n) ? n : 0
}

const listeners = new Set<Listener>()
const sinks = new Set<ClockSink>()
let intervalId: ReturnType<typeof setInterval> | null = null

let state: ScorebugClockState = {
  running: false,
  clock: basketballGameDefaults.clock,
  shotClock: basketballGameDefaults.shotClock,
}

function emit() {
  for (const listener of listeners) listener()
}

function setState(partial: Partial<ScorebugClockState>) {
  state = { ...state, ...partial }
  emit()
}

function clearTicker() {
  if (intervalId == null) return
  clearInterval(intervalId)
  intervalId = null
}

function notifySinks(tick: ScorebugClockTick) {
  for (const sink of sinks) sink(tick)
}

function tickOnce() {
  const remaining = clockToSeconds(state.clock)
  if (remaining <= 0) {
    clearTicker()
    setState({ running: false })
    return
  }

  const nextClock = secondsToClock(remaining - 1)
  const nextShot = state.shotClock > 0 ? state.shotClock - 1 : state.shotClock
  const hitZero = remaining - 1 <= 0

  setState({
    clock: nextClock,
    shotClock: nextShot,
    ...(hitZero ? { running: false } : null),
  })

  if (hitZero) clearTicker()

  notifySinks({ clock: nextClock, shotClock: nextShot })
}

function ensureTicker() {
  if (!state.running || intervalId != null) return
  intervalId = setInterval(tickOnce, 1000)
}

export function getScorebugClockSnapshot(): ScorebugClockState {
  return state
}

export function subscribeScorebugClock(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Register a Controls patch sink; returns unsubscribe. */
export function registerScorebugClockSink(sink: ClockSink): () => void {
  sinks.add(sink)
  return () => {
    sinks.delete(sink)
  }
}

export function setScorebugClockValues(
  clock: string,
  shotClock: number | string,
): void {
  setState({
    clock,
    shotClock: numericValue(shotClock),
  })
}

export function setScorebugClockRunning(running: boolean): void {
  if (running === state.running) {
    if (running) ensureTicker()
    return
  }

  if (!running) {
    clearTicker()
    setState({ running: false })
    return
  }

  setState({ running: true })
  ensureTicker()
}

export function useScorebugClock(): ScorebugClockState {
  return useSyncExternalStore(
    subscribeScorebugClock,
    getScorebugClockSnapshot,
    getScorebugClockSnapshot,
  )
}
