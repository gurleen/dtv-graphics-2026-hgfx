import { useMemo, useRef, useState } from 'react'
import {
  findTeam,
  getTeamKnockoutLogo,
  teams,
  type TeamInfo,
} from '../../src/data/teams'

function matchesQuery(team: TeamInfo, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    team.display_name.toLowerCase().includes(q) ||
    team.abbreviation.toLowerCase().includes(q) ||
    team.mascot.toLowerCase().includes(q) ||
    team.short_name.toLowerCase().includes(q) ||
    team.team.toLowerCase().includes(q)
  )
}

export function AwayTeamSwitcher({
  awayTeamId,
  onChange,
}: {
  awayTeamId: number
  onChange: (teamId: number) => void
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const selected = findTeam(awayTeamId)

  const results = useMemo(
    () => teams.filter((team) => matchesQuery(team, query.trim())),
    [query],
  )

  return (
    <details
      ref={detailsRef}
      className="away-switcher"
      onToggle={(event) => {
        if ((event.currentTarget as HTMLDetailsElement).open) {
          setQuery('')
          queueMicrotask(() => searchRef.current?.focus())
        }
      }}
    >
      <summary className="away-switcher-summary">
        <span className="away-switcher-label">Away team</span>
        {selected ? (
          <>
            <span
              className="away-switcher-swatch"
              style={{
                background: selected.color.startsWith('#')
                  ? selected.color
                  : `#${selected.color}`,
              }}
            />
            <img
              className="away-switcher-logo"
              src={getTeamKnockoutLogo(selected)}
              alt=""
            />
            <span className="away-switcher-name">{selected.display_name}</span>
          </>
        ) : (
          <span className="away-switcher-name">Select a team</span>
        )}
      </summary>
      <div className="away-switcher-panel">
        <input
          ref={searchRef}
          type="search"
          className="away-switcher-search"
          placeholder="Search teams…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        <ul className="away-switcher-list" role="listbox">
          {results.map((team) => {
            const active = team.team_id === awayTeamId
            return (
              <li key={team.team_id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className="away-switcher-option"
                  onClick={() => {
                    onChange(team.team_id)
                    const root = detailsRef.current
                    if (root) root.open = false
                  }}
                >
                  <span
                    className="away-switcher-swatch"
                    style={{
                      background: team.color.startsWith('#')
                        ? team.color
                        : `#${team.color}`,
                    }}
                  />
                  {team.display_name}
                </button>
              </li>
            )
          })}
          {results.length === 0 ? (
            <li className="away-switcher-empty">No teams match</li>
          ) : null}
        </ul>
      </div>
    </details>
  )
}
