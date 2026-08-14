import { useEffect, useRef, type CSSProperties } from 'react'
import { Button, FieldRow, Input, Select, Slider, Switch } from '@hydra-tv/ui'
import type { TemplateControlsProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { scorebugDefaults, type ScorebugProps } from './schema'
import {
  numericValue,
  registerScorebugClockSink,
  setScorebugClockRunning,
  setScorebugClockValues,
  useScorebugClock,
} from './clockTicker'

export const PERIOD_OPTIONS = [
  '1ST',
  '2ND',
  'HALF',
  '3RD',
  '4TH',
  'OT',
  '2OT',
] as const

const TIMEOUT_MAX = 4

const rowCluster: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
}

const readout: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--fg-1)',
  minWidth: '2ch',
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
}

function Section({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '6px 0 3px',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-3)',
        borderBottom: '1px solid var(--line-1)',
        marginBottom: 4,
        marginTop: 4,
      }}
    >
      {label}
    </div>
  )
}

function parseIntField(value: string, fallback: number): number {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) ? n : fallback
}

function parseNumberField(value: string, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function periodOptions(current: string): string[] {
  if ((PERIOD_OPTIONS as readonly string[]).includes(current) || current === '') {
    return [...PERIOD_OPTIONS]
  }
  return [current, ...PERIOD_OPTIONS]
}

function ScoreButtons({
  label,
  value,
  onDelta,
}: {
  label: string
  value: number
  onDelta: (delta: number) => void
}) {
  return (
    <FieldRow label={label}>
      <div style={rowCluster}>
        <span style={{ ...readout, minWidth: '3ch' }}>{value}</span>
        <Button label="+1" size="sm" onClick={() => onDelta(1)} />
        <Button label="+2" size="sm" onClick={() => onDelta(2)} />
        <Button label="+3" size="sm" onClick={() => onDelta(3)} />
        <Button label="−1" size="sm" onClick={() => onDelta(-1)} />
      </div>
    </FieldRow>
  )
}

function TimeoutStepper({
  label,
  value,
  onDelta,
  bonus,
  onBonus,
}: {
  label: string
  value: number
  onDelta: (delta: number) => void
  bonus: boolean
  onBonus: (next: boolean) => void
}) {
  return (
    <FieldRow label={label}>
      <div style={rowCluster}>
        <Button
          label="−"
          size="sm"
          disabled={value <= 0}
          onClick={() => onDelta(-1)}
        />
        <span style={readout}>{value}</span>
        <Button
          label="+"
          size="sm"
          disabled={value >= TIMEOUT_MAX}
          onClick={() => onDelta(1)}
        />
        <Switch
          checked={bonus}
          labels={['OFF', 'BONUS']}
          onChange={onBonus}
        />
      </div>
    </FieldRow>
  )
}

function NumberField({
  label,
  value,
  onCommit,
}: {
  label: string
  value: number
  onCommit: (next: number) => void
}) {
  return (
    <FieldRow label={label}>
      <Input
        value={String(value)}
        width="100%"
        align="right"
        onChange={(raw) => onCommit(parseNumberField(raw, value))}
      />
    </FieldRow>
  )
}

const LOGO_SCALE_MIN = 0.8
const LOGO_SCALE_MAX = 3.5
const LOGO_SCALE_STEP = 0.05

function LogoScaleField({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string
  value: number
  defaultValue: number
  onChange: (next: number) => void
}) {
  return (
    <FieldRow label={label}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minWidth: 0,
          width: '100%',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Slider
            value={value}
            min={LOGO_SCALE_MIN}
            max={LOGO_SCALE_MAX}
            step={LOGO_SCALE_STEP}
            width="100%"
            onChange={onChange}
          />
        </div>
        <Button
          label="Reset"
          size="sm"
          disabled={value === defaultValue}
          title={`Reset to ${defaultValue}`}
          onClick={() => onChange(defaultValue)}
          style={{ flexShrink: 0 }}
        />
      </div>
    </FieldRow>
  )
}

export default function ScorebugControls({
  props,
  patch,
}: TemplateControlsProps<ScorebugProps>) {
  const clockState = useScorebugClock()
  const patchRef = useRef(patch)
  patchRef.current = patch

  useEffect(() => {
    return registerScorebugClockSink((tick) => {
      patchRef.current({ clock: tick.clock, shotClock: tick.shotClock })
    })
  }, [])

  useEffect(() => {
    if (clockState.running) return
    const shot = numericValue(props.shotClock)
    if (props.clock === clockState.clock && shot === clockState.shotClock) return
    setScorebugClockValues(props.clock, shot)
  }, [
    props.clock,
    props.shotClock,
    clockState.running,
    clockState.clock,
    clockState.shotClock,
  ])

  const bumpScore = (side: 'homeScore' | 'awayScore', delta: number) => {
    patch({ [side]: Math.max(0, numericValue(props[side]) + delta) })
  }

  const bumpTimeouts = (side: 'homeTimeouts' | 'awayTimeouts', delta: number) => {
    patch({
      [side]: clampInt(numericValue(props[side]) + delta, 0, TIMEOUT_MAX),
    })
  }

  const bumpShotClock = (delta: number) => {
    const next = Math.max(0, numericValue(props.shotClock) + delta)
    setScorebugClockValues(clockState.clock, next)
    patch({ shotClock: next })
  }

  const startClock = () => {
    setScorebugClockValues(props.clock, props.shotClock)
    setScorebugClockRunning(true)
  }

  const stopClock = () => {
    setScorebugClockRunning(false)
  }

  const resetClock = () => {
    setScorebugClockRunning(false)
    const clock = scorebugDefaults.clock
    setScorebugClockValues(clock, clockState.shotClock)
    patch({ clock })
  }

  const resetShotClock = () => {
    const shotClock = scorebugDefaults.shotClock
    setScorebugClockValues(clockState.clock, shotClock)
    patch({ shotClock })
  }

  const displayClock = clockState.running ? clockState.clock : props.clock
  const displayShot = clockState.running
    ? clockState.shotClock
    : numericValue(props.shotClock)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <Section label="Game" />
      <ScoreButtons
        label="Away score"
        value={numericValue(props.awayScore)}
        onDelta={(delta) => bumpScore('awayScore', delta)}
      />
      <ScoreButtons
        label="Home score"
        value={numericValue(props.homeScore)}
        onDelta={(delta) => bumpScore('homeScore', delta)}
      />
      <FieldRow label="Clock">
        <div style={rowCluster}>
          <Input
            value={displayClock}
            width={80}
            onChange={(value) => {
              setScorebugClockRunning(false)
              setScorebugClockValues(value, clockState.shotClock)
              patch({ clock: value })
            }}
          />
          <Button
            label="Start"
            size="sm"
            variant={clockState.running ? 'default' : 'accent'}
            active={clockState.running}
            disabled={clockState.running}
            onClick={startClock}
          />
          <Button
            label="Stop"
            size="sm"
            variant={clockState.running ? 'armed' : 'default'}
            disabled={!clockState.running}
            onClick={stopClock}
          />
          <Button label="Reset" size="sm" onClick={resetClock} />
        </div>
      </FieldRow>
      <FieldRow label="Shot clock">
        <div style={rowCluster}>
          <Button label="−" size="sm" onClick={() => bumpShotClock(-1)} />
          <span style={readout}>{displayShot}</span>
          <Button label="+" size="sm" onClick={() => bumpShotClock(1)} />
          <Button label="Reset" size="sm" onClick={resetShotClock} />
        </div>
      </FieldRow>
      <FieldRow label="Period">
        <Select
          value={props.period}
          options={periodOptions(props.period)}
          width="100%"
          onChange={(value) => patch({ period: value })}
        />
      </FieldRow>
      <TimeoutStepper
        label="Away TOs"
        value={clampInt(numericValue(props.awayTimeouts), 0, TIMEOUT_MAX)}
        onDelta={(delta) => bumpTimeouts('awayTimeouts', delta)}
        bonus={props.awayBonus}
        onBonus={(awayBonus) => patch({ awayBonus })}
      />
      <TimeoutStepper
        label="Home TOs"
        value={clampInt(numericValue(props.homeTimeouts), 0, TIMEOUT_MAX)}
        onDelta={(delta) => bumpTimeouts('homeTimeouts', delta)}
        bonus={props.homeBonus}
        onBonus={(homeBonus) => patch({ homeBonus })}
      />

      <Section label="Teams" />
      <FieldRow label="Home team ID">
        <Input
          value={String(props.homeTeamId)}
          width="100%"
          align="right"
          onChange={(raw) =>
            patch({ homeTeamId: parseIntField(raw, props.homeTeamId) })
          }
        />
      </FieldRow>
      <FieldRow label="Away team ID">
        <Input
          value={String(props.awayTeamId)}
          width="100%"
          align="right"
          onChange={(raw) =>
            patch({ awayTeamId: parseIntField(raw, props.awayTeamId) })
          }
        />
      </FieldRow>
      <LogoScaleField
        label="Home logo scale"
        value={props.homeLogoScale}
        defaultValue={scorebugDefaults.homeLogoScale}
        onChange={(homeLogoScale) => patch({ homeLogoScale })}
      />
      <LogoScaleField
        label="Away logo scale"
        value={props.awayLogoScale}
        defaultValue={scorebugDefaults.awayLogoScale}
        onChange={(awayLogoScale) => patch({ awayLogoScale })}
      />

      <Section label="Score" />
      <NumberField
        label="Home score"
        value={numericValue(props.homeScore)}
        onCommit={(homeScore) => patch({ homeScore: Math.max(0, homeScore) })}
      />
      <NumberField
        label="Away score"
        value={numericValue(props.awayScore)}
        onCommit={(awayScore) => patch({ awayScore: Math.max(0, awayScore) })}
      />

      <Section label="Clock" />
      <FieldRow label="Clock">
        <Input
          value={displayClock}
          width="100%"
          onChange={(clock) => {
            setScorebugClockRunning(false)
            setScorebugClockValues(clock, clockState.shotClock)
            patch({ clock })
          }}
        />
      </FieldRow>
      <NumberField
        label="Shot clock"
        value={displayShot}
        onCommit={(shotClock) => {
          const next = Math.max(0, shotClock)
          setScorebugClockValues(clockState.clock, next)
          patch({ shotClock: next })
        }}
      />
      <FieldRow label="Period">
        <Input
          value={props.period}
          width="100%"
          onChange={(period) => patch({ period })}
        />
      </FieldRow>

      <Section label="Timeouts" />
      <NumberField
        label="Home timeouts"
        value={clampInt(numericValue(props.homeTimeouts), 0, TIMEOUT_MAX)}
        onCommit={(homeTimeouts) =>
          patch({ homeTimeouts: clampInt(homeTimeouts, 0, TIMEOUT_MAX) })
        }
      />
      <NumberField
        label="Away timeouts"
        value={clampInt(numericValue(props.awayTimeouts), 0, TIMEOUT_MAX)}
        onCommit={(awayTimeouts) =>
          patch({ awayTimeouts: clampInt(awayTimeouts, 0, TIMEOUT_MAX) })
        }
      />
      <FieldRow label="Home bonus">
        <Switch
          checked={props.homeBonus}
          onChange={(homeBonus) => patch({ homeBonus })}
        />
      </FieldRow>
      <FieldRow label="Away bonus">
        <Switch
          checked={props.awayBonus}
          onChange={(awayBonus) => patch({ awayBonus })}
        />
      </FieldRow>

      <Section label="Brand" />
      <FieldRow label="Sponsor logo URL override">
        <Input
          value={props.sponsorLogoUrl}
          width="100%"
          onChange={(sponsorLogoUrl) => patch({ sponsorLogoUrl })}
        />
      </FieldRow>
    </div>
  )
}
