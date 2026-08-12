import { useEffect, useMemo, useState } from 'react'
import { Button, Select, SideNav } from '@hydra-tv/ui'
import type { PackagePanelProps } from '@hydra-tv/hydra-gfx-runtime/types'
import {
  type PackageConfig,
  SPORTS,
  sportLabel,
} from '../config'
import {
  findTeam,
  getTeamKnockoutLogo,
  getTeamLogo,
  teamSearchOptions,
  type TeamInfo,
} from '../data/teams'

type Section = 'matchup'
type TeamSide = 'home' | 'away'

const SECTION_ITEMS = [{ key: 'matchup', label: 'MATCHUP' }]

/**
 * Package-registered rundown tab — sport + home/away team selection.
 * Appears next to PLAYOUT/… once the rundown attaches `dtv-2026`.
 */
export default function SettingsPanel({
  config,
  patchConfig,
}: PackagePanelProps<PackageConfig>) {
  const [section, setSection] = useState<Section>('matchup')

  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        minHeight: 360,
        alignItems: 'stretch',
      }}
    >
      <SideNav
        items={SECTION_ITEMS}
        active={section}
        onChange={(key) => setSection(key as Section)}
        width={120}
      />
      <div style={{ flex: 1, minWidth: 0, padding: 16 }}>
        {section === 'matchup' ? (
          <MatchupSection config={config} patchConfig={patchConfig} />
        ) : null}
      </div>
    </div>
  )
}

function MatchupSection({
  config,
  patchConfig,
}: {
  config: PackageConfig
  patchConfig: (patch: Partial<PackageConfig>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--fg-3)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Selected sport:{' '}
          <span style={{ color: 'var(--fg-1)', fontWeight: 700 }}>
            {sportLabel(config.sport)}
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          {SPORTS.map((s) => (
            <Button
              key={s}
              label={sportLabel(s)}
              size="lg"
              variant={config.sport === s ? 'accent' : 'default'}
              active={config.sport === s}
              onClick={() => patchConfig({ sport: s })}
              style={{ width: '100%', minHeight: 64 }}
            />
          ))}
        </div>
      </div>
      <TeamSection config={config} patchConfig={patchConfig} />
    </div>
  )
}

function TeamSection({
  config,
  patchConfig,
}: {
  config: PackageConfig
  patchConfig: (patch: Partial<PackageConfig>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <TeamSelect
        side="home"
        committedId={config.homeTeamId}
        onCommit={(teamId) => patchConfig({ homeTeamId: teamId })}
      />
      <TeamSelect
        side="away"
        committedId={config.awayTeamId}
        onCommit={(teamId) => patchConfig({ awayTeamId: teamId })}
      />
    </div>
  )
}

function TeamSelect({
  side,
  committedId,
  onCommit,
}: {
  side: TeamSide
  committedId: number
  onCommit: (teamId: number) => void
}) {
  const options = useMemo(() => teamSearchOptions(), [])
  const [draftId, setDraftId] = useState(committedId)
  const [usingColorLogo, setUsingColorLogo] = useState(true)

  useEffect(() => {
    setDraftId(committedId)
  }, [committedId])

  const team = findTeam(committedId)
  const draftMatches = draftId === committedId
  const selectValue =
    draftId > 0 && options.some((o) => o.value === String(draftId))
      ? String(draftId)
      : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--fg-3)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {side === 'home' ? 'Home team' : 'Away team'}
      </div>
      {team ? (
        <TeamDetail
          team={team}
          usingColorLogo={usingColorLogo}
          onToggleLogo={() => setUsingColorLogo((v) => !v)}
        />
      ) : (
        <div
          style={{
            padding: 16,
            border: '1px solid var(--line-1)',
            color: 'var(--fg-3)',
            fontSize: 12,
          }}
        >
          No {side} team set. Pick a team below and press SET TEAM.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Select
          value={selectValue}
          options={options}
          width="100%"
          onChange={(v) => {
            const id = Number(v)
            if (Number.isFinite(id)) setDraftId(id)
          }}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button
          label="SET TEAM"
          variant="accent"
          disabled={draftMatches || draftId <= 0}
          onClick={() => onCommit(draftId)}
        />
      </div>
    </div>
  )
}

function TeamDetail({
  team,
  usingColorLogo,
  onToggleLogo,
}: {
  team: TeamInfo
  usingColorLogo: boolean
  onToggleLogo: () => void
}) {
  const logoUrl = usingColorLogo ? getTeamLogo(team) : getTeamKnockoutLogo(team)
  const websiteHref = team.website.startsWith('http')
    ? team.website
    : `https://${team.website}`

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        border: '1px solid var(--line-1)',
        minHeight: 140,
      }}
    >
      <button
        type="button"
        onClick={onToggleLogo}
        title="Toggle color / knockout logo"
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: 12,
          border: 'none',
          borderRight: '1px solid var(--line-1)',
          background: 'var(--bg-2, transparent)',
          cursor: 'pointer',
        }}
      >
        <img
          src={logoUrl}
          alt={`${team.display_name} logo`}
          style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }}
        />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div
          style={{
            textAlign: 'center',
            padding: '10px 12px',
            borderBottom: '1px solid var(--line-1)',
            fontSize: 16,
          }}
        >
          <span>{team.team}</span>{' '}
          <span style={{ fontWeight: 700 }}>{team.mascot}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
          <ColorSwatch hex={team.color} />
          <ColorSwatch hex={team.alternate_color} />
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '8px 12px',
            borderTop: '1px solid var(--line-1)',
            fontSize: 11,
          }}
        >
          <a
            href={websiteHref}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            {team.website}
          </a>
        </div>
      </div>
    </div>
  )
}

function ColorSwatch({ hex }: { hex: string }) {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`
  const [copied, setCopied] = useState(false)
  const fg = contrastColor(normalized)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(normalized.toUpperCase())
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1200)
        } catch {
          /* ignore */
        }
      }}
      style={{
        border: 'none',
        borderRight: '1px solid var(--line-1)',
        background: normalized,
        color: fg,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        minHeight: 48,
      }}
    >
      {copied ? 'COPIED' : normalized.toUpperCase()}
    </button>
  )
}

function contrastColor(hex: string): string {
  const raw = hex.replace('#', '')
  if (raw.length !== 6) return '#FFFFFF'
  const r = Number.parseInt(raw.slice(0, 2), 16) / 255
  const g = Number.parseInt(raw.slice(2, 4), 16) / 255
  const b = Number.parseInt(raw.slice(4, 6), 16) / 255
  const toLin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  const luminance = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b)
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
