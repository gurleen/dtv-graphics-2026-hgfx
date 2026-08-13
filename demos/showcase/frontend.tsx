import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { templateCatalog, type TemplateId } from '../../src/templates/registry'
import { showcaseRegistry } from '../../src/templates/showcaseRegistry'

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
          <Preview key={activeId} autoIn />
        </Suspense>
      </main>
    </div>
  )
}

document.body.style.margin = '0'
const root = createRoot(document.body)
root.render(<ShowcasePage />)
