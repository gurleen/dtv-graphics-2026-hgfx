import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { templateCatalog, type TemplateId } from '../../src/templates/registry'
import { showcaseRegistry } from '../../src/templates/showcaseRegistry'

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
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <header
        style={{
          padding: '24px 40px 0',
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
          DTV 2026 graphics
        </h1>
        <p style={{ color: '#9aa0a6', margin: '0 0 24px', maxWidth: 720, lineHeight: 1.5 }}>
          Stakeholder preview. Pick a graphic, then use IN / OUT to take it.
          Share a tab with the hash in the URL (for example{' '}
          <code style={{ color: '#c4c7c5' }}>#matchup</code>).
        </p>
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            borderBottom: '1px solid #333',
            paddingBottom: 0,
          }}
        >
          {templateCatalog.map((entry) => {
            const active = entry.id === activeId
            return (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: 14,
                  color: active ? '#f5f5f5' : '#9aa0a6',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid #f5f5f5' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {entry.name}
              </a>
            )
          })}
        </nav>
      </header>
      <main style={{ padding: 40 }}>
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
