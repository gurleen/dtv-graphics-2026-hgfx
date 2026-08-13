import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { templateCatalog, type TemplateId } from '../../src/templates/registry'
import { showcaseRegistry } from '../../src/templates/showcaseRegistry'
import { SHOWCASE_AWAY_TEAM_ID } from '../../src/templates/shared/showcaseSample'
import { AwayTeamSwitcher } from './AwayTeamSwitcher'

const PAGE_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; overflow-x: hidden; }
  .showcase {
    min-height: 100vh;
    min-height: 100dvh;
    background: #111;
    color: #f5f5f5;
    font-family: system-ui, sans-serif;
  }
  .showcase-header {
    padding: 24px 40px 0;
  }
  .showcase-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 16px;
  }
  .away-switcher {
    margin: 0 0 16px;
    border: 1px solid #333;
    border-radius: 4px;
    background: #1a1a1a;
  }
  .away-switcher-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    list-style: none;
    min-height: 44px;
  }
  .away-switcher-summary::-webkit-details-marker,
  .away-switcher-summary::marker { display: none; content: ''; }
  .away-switcher-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9aa0a6;
    flex-shrink: 0;
  }
  .away-switcher-swatch {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .away-switcher-logo {
    height: 22px;
    width: auto;
    max-width: 36px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .away-switcher-name {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 700;
    color: #f5f5f5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .away-switcher-summary::after {
    content: '';
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-right: 2px solid #9aa0a6;
    border-bottom: 2px solid #9aa0a6;
    transform: rotate(45deg);
    margin-top: -4px;
  }
  .away-switcher[open] .away-switcher-summary::after {
    transform: rotate(-135deg);
    margin-top: 2px;
  }
  .away-switcher-panel {
    border-top: 1px solid #333;
    padding: 12px;
  }
  .away-switcher-search {
    width: 100%;
    padding: 8px 10px;
    margin: 0 0 8px;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    color: #f5f5f5;
    font-size: 16px;
  }
  .away-switcher-list {
    max-height: 240px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .away-switcher-option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #f5f5f5;
    cursor: pointer;
    font-size: 14px;
  }
  .away-switcher-option:hover,
  .away-switcher-option[aria-selected="true"] {
    background: #333;
  }
  .away-switcher-empty {
    padding: 8px 10px;
    color: #9aa0a6;
    font-size: 14px;
  }
  .showcase-nav {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid #333;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .showcase-nav::-webkit-scrollbar { display: none; }
  .showcase-tab {
    flex-shrink: 0;
    display: inline-block;
    padding: 10px 16px;
    font-weight: 700;
    font-size: 14px;
    color: #9aa0a6;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
  }
  .showcase-tab[aria-current="page"] {
    color: #f5f5f5;
    border-bottom-color: #f5f5f5;
  }
  .showcase-main {
    padding: 40px;
  }
  @media (max-width: 720px) {
    .showcase-header { padding: 16px 16px 0; }
    .showcase-title { font-size: 20px; margin-bottom: 12px; }
    .showcase-tab { padding: 10px 12px; font-size: 13px; }
    .showcase-main { padding: 16px; }
  }
`

function isTemplateId(id: string): id is TemplateId {
  return id in showcaseRegistry
}

function idFromHash(): TemplateId | null {
  const raw = window.location.hash.replace(/^#/, '')
  return isTemplateId(raw) ? raw : null
}

function ShowcasePage() {
  const [activeId, setActiveId] = useState<TemplateId>(
    () => idFromHash() ?? templateCatalog[0].id,
  )
  const [awayTeamId, setAwayTeamId] = useState(SHOWCASE_AWAY_TEAM_ID)

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${activeId}`)
    }
  }, [activeId])

  useEffect(() => {
    const onHash = () => {
      const id = idFromHash()
      if (id) setActiveId(id)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Preview = useMemo(() => lazy(showcaseRegistry[activeId]), [activeId])

  return (
    <div className="showcase">
      <style>{PAGE_CSS}</style>
      <header className="showcase-header">
        <h1 className="showcase-title">DTV 2026 graphics</h1>
        <AwayTeamSwitcher awayTeamId={awayTeamId} onChange={setAwayTeamId} />
        <nav className="showcase-nav">
          {templateCatalog.map((entry) => {
            const active = entry.id === activeId
            return (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className="showcase-tab"
                aria-current={active ? 'page' : undefined}
              >
                {entry.name}
              </a>
            )
          })}
        </nav>
      </header>
      <main className="showcase-main">
        <Suspense
          fallback={
            <p style={{ color: '#9aa0a6', margin: 0 }}>Loading graphic…</p>
          }
        >
          <Preview key={activeId} autoIn awayTeamId={awayTeamId} />
        </Suspense>
      </main>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<ShowcasePage />)
