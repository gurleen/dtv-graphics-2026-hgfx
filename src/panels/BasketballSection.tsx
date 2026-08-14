import { useEffect, useMemo, useRef } from 'react'
import { FieldRow, Input, Switch } from '@hydra-tv/ui'
import type { PackagePanelProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type { PackageConfig } from '../config'
import {
  type BasketballGameField,
  type BasketballGameState,
  mergeBasketballState,
  parseBasketballGameState,
} from '../data/basketball'

const BASKETBALL_DATA_KEY = 'basketball'

const FIELD_LABELS: Record<BasketballGameField, string> = {
  homeScore: 'Home score',
  awayScore: 'Away score',
  clock: 'Clock',
  shotClock: 'Shot clock',
  period: 'Period',
  homeTimeouts: 'Home timeouts',
  awayTimeouts: 'Away timeouts',
  homeBonus: 'Home bonus',
  awayBonus: 'Away bonus',
}

export function BasketballSection({
  config,
  patchConfig,
  data,
  publishData,
}: Pick<
  PackagePanelProps<PackageConfig>,
  'config' | 'patchConfig' | 'data' | 'publishData'
>) {
  const live = useMemo(
    () =>
      parseBasketballGameState(
        data.find((d) => d.key === BASKETBALL_DATA_KEY)?.value,
      ),
    [data],
  )
  const seeded = useRef(false)

  useEffect(() => {
    if (live || seeded.current) return
    seeded.current = true
    publishData(
      BASKETBALL_DATA_KEY,
      mergeBasketballState(
        undefined,
        config.basketball,
        config.basketballOverrides,
      ),
    )
  }, [live, config.basketball, config.basketballOverrides, publishData])

  const display = mergeBasketballState(
    live,
    config.basketball,
    config.basketballOverrides,
  )

  function publish(
    values: BasketballGameState,
    overrides: PackageConfig['basketballOverrides'],
  ) {
    publishData(
      BASKETBALL_DATA_KEY,
      mergeBasketballState(live, values, overrides),
    )
  }

  function setField<K extends BasketballGameField>(
    field: K,
    value: BasketballGameState[K],
  ) {
    const basketball = { ...config.basketball, [field]: value }
    const basketballOverrides = { ...config.basketballOverrides, [field]: true }
    patchConfig({ basketball, basketballOverrides })
    publish(basketball, basketballOverrides)
  }

  function setOverride(field: BasketballGameField, on: boolean) {
    const basketballOverrides = { ...config.basketballOverrides, [field]: on }
    patchConfig({ basketballOverrides })
    publish(config.basketball, basketballOverrides)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--fg-3)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Backup game state — edit a field to pin it over live data
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <div>
          <SectionLabel>Away</SectionLabel>
          <NumberField
            field="awayScore"
            value={display.awayScore}
            overridden={config.basketballOverrides.awayScore}
            onChange={(n) => setField('awayScore', n)}
            onOverride={(on) => setOverride('awayScore', on)}
          />
          <NumberField
            field="awayTimeouts"
            value={display.awayTimeouts}
            overridden={config.basketballOverrides.awayTimeouts}
            min={0}
            max={4}
            onChange={(n) => setField('awayTimeouts', clampInt(n, 0, 4))}
            onOverride={(on) => setOverride('awayTimeouts', on)}
          />
          <BooleanField
            field="awayBonus"
            value={display.awayBonus}
            overridden={config.basketballOverrides.awayBonus}
            onChange={(v) => setField('awayBonus', v)}
            onOverride={(on) => setOverride('awayBonus', on)}
          />
        </div>
        <div>
          <SectionLabel>Home</SectionLabel>
          <NumberField
            field="homeScore"
            value={display.homeScore}
            overridden={config.basketballOverrides.homeScore}
            onChange={(n) => setField('homeScore', n)}
            onOverride={(on) => setOverride('homeScore', on)}
          />
          <NumberField
            field="homeTimeouts"
            value={display.homeTimeouts}
            overridden={config.basketballOverrides.homeTimeouts}
            min={0}
            max={4}
            onChange={(n) => setField('homeTimeouts', clampInt(n, 0, 4))}
            onOverride={(on) => setOverride('homeTimeouts', on)}
          />
          <BooleanField
            field="homeBonus"
            value={display.homeBonus}
            overridden={config.basketballOverrides.homeBonus}
            onChange={(v) => setField('homeBonus', v)}
            onOverride={(on) => setOverride('homeBonus', on)}
          />
        </div>
      </div>

      <div>
        <SectionLabel>Clock</SectionLabel>
        <TextField
          field="clock"
          value={display.clock}
          overridden={config.basketballOverrides.clock}
          onChange={(v) => setField('clock', v)}
          onOverride={(on) => setOverride('clock', on)}
        />
        <NumberField
          field="shotClock"
          value={display.shotClock}
          overridden={config.basketballOverrides.shotClock}
          min={0}
          onChange={(n) => setField('shotClock', Math.max(0, n))}
          onOverride={(on) => setOverride('shotClock', on)}
        />
        <TextField
          field="period"
          value={display.period}
          overridden={config.basketballOverrides.period}
          onChange={(v) => setField('period', v)}
          onOverride={(on) => setOverride('period', on)}
        />
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
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
      }}
    >
      {children}
    </div>
  )
}

function OverrideSwitch({
  overridden,
  onOverride,
}: {
  overridden: boolean
  onOverride: (on: boolean) => void
}) {
  return (
    <Switch
      checked={overridden}
      labels={['LIVE', 'OVERRIDE']}
      onChange={onOverride}
    />
  )
}

function TextField({
  field,
  value,
  overridden,
  onChange,
  onOverride,
}: {
  field: BasketballGameField
  value: string
  overridden: boolean
  onChange: (value: string) => void
  onOverride: (on: boolean) => void
}) {
  return (
    <FieldRow label={FIELD_LABELS[field]}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
        <Input
          value={value}
          width="100%"
          onChange={(v) => onChange(String(v))}
        />
        <OverrideSwitch overridden={overridden} onOverride={onOverride} />
      </div>
    </FieldRow>
  )
}

function NumberField({
  field,
  value,
  overridden,
  min,
  max,
  onChange,
  onOverride,
}: {
  field: BasketballGameField
  value: number
  overridden: boolean
  min?: number
  max?: number
  onChange: (value: number) => void
  onOverride: (on: boolean) => void
}) {
  return (
    <FieldRow label={FIELD_LABELS[field]}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
        <Input
          type="number"
          value={String(value)}
          width="100%"
          align="right"
          onChange={(v) => {
            const n = Number(v)
            if (!Number.isFinite(n)) return
            let next = n
            if (min != null) next = Math.max(min, next)
            if (max != null) next = Math.min(max, next)
            onChange(next)
          }}
        />
        <OverrideSwitch overridden={overridden} onOverride={onOverride} />
      </div>
    </FieldRow>
  )
}

function BooleanField({
  field,
  value,
  overridden,
  onChange,
  onOverride,
}: {
  field: BasketballGameField
  value: boolean
  overridden: boolean
  onChange: (value: boolean) => void
  onOverride: (on: boolean) => void
}) {
  return (
    <FieldRow label={FIELD_LABELS[field]}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
        <Switch checked={value} labels={['OFF', 'ON']} onChange={onChange} />
        <OverrideSwitch overridden={overridden} onOverride={onOverride} />
      </div>
    </FieldRow>
  )
}

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)))
}
