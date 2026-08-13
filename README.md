# DTV Graphics 2026 — HYDRA // GFX package

Standalone template package for HYDRA // GFX. Compiles to a single `.hgfx.js` artifact with `@hydra-tv/hydra-gfx-sdk`.

Requires **Bun >= 1.1**.

## Templates

Registered in [`src/templates/registry.ts`](src/templates/registry.ts). The stakeholder showcase tabs are built from this list — add a `Showcase.tsx` and a matching key in [`src/templates/showcaseRegistry.ts`](src/templates/showcaseRegistry.ts) when you add a template.

| id | route |
|----|-------|
| `matchup` | `/graphics/p/dtv-2026/matchup` |
| `score-to-break` | `/graphics/p/dtv-2026/score-to-break` |
| `talent-single` | `/graphics/p/dtv-2026/talent-single` |
| `talent-double` | `/graphics/p/dtv-2026/talent-double` |

## Setup

```bash
bun install
```

## Build

```bash
bun run build
# → dist/dtv-2026.hgfx.js
```

## Install into a host

Copy the artifact into the host packages directory:

```bash
cp dist/dtv-2026.hgfx.js /path/to/dtv-graphics-2027/data/packages/
```

Or upload it in the host UI: **Control → Packages**.

### Dev watch loop

Rebuild directly into a local host checkout on change:

```bash
bunx hydra-gfx build --watch --out /path/to/dtv-graphics-2027/data/packages
```

## Preview

After install:

```
/graphics/p/dtv-2026/matchup?preview=1
/graphics/p/dtv-2026/score-to-break?preview=1
/graphics/p/dtv-2026/talent-single?preview=1
/graphics/p/dtv-2026/talent-double?preview=1
```

## Showcase (stakeholder approval)

Tabbed previews of every registered graphic. Local:

```bash
bun run demo
# Developer scroll page:  http://127.0.0.1:3456/
# Stakeholder showcase:   http://127.0.0.1:3456/showcase
```

Share a specific graphic with the hash, e.g. `/showcase#matchup`.

### Publish to Cloudflare Pages

```bash
bun run build:showcase
# → showcase-dist/

# First time only: create the Pages project, then deploy
bunx wrangler pages project create dtv-2026-graphics-showcase
bun run deploy:showcase
```

Git-connected Pages: build command `bun run build:showcase`, output directory `showcase-dist`. The published site is the showcase at the domain root; share a graphic with `/#matchup` (or `/showcase#matchup` when running locally).

## Porting graphics

See [docs/PORTING.md](docs/PORTING.md) for the HYDRA / GSAP checklist, and [docs/DESIGN_LANGUAGE.md](docs/DESIGN_LANGUAGE.md) for the look (matchup is the reference).

## GSAP playout (porting from SPX / dtv-graphics-2026)

Graphics use **GSAP** for in/out. `gsap` and `@gsap/react` are package dependencies and are **bundled** into the `.hgfx.js` (do not list them in `hydra.config.ts` `shared`).

Helpers live in `src/lib/gsap`:

| Helper | Use for |
|--------|---------|
| `useGsapPlayout(onScreen, animFunc, deps?)` | Main graphic take/lose (replaces SPX `play` / `stop`) |
| `useGsapToggle(playing, animFunc, deps?, ready?)` | Nested state-driven clips (old `useSubAnimation`) |

Timeline contract matches the old show package — intro, hold, outro:

```ts
import { useGsapPlayout } from '../../lib/gsap'

function animation(tl: gsap.core.Timeline, root: HTMLElement) {
  tl.from('#panel', { opacity: 0, duration: 0.4 })
    .addPause() // hold while on air
    .to(root, { opacity: 0, duration: 0.3 }) // fade scope via `root`, not `#id` on it
}

export default function MyGraphic({ onScreen }: TemplateRenderProps<Props>) {
  const scope = useGsapPlayout(onScreen, animation)
  return (
    <HtmlCanvas>
      <div ref={scope} style={{ width: '100%', height: '100%' }}>
        <div id="panel">…</div>
      </div>
    </HtmlCanvas>
  )
}
```

- `onScreen === true` → play from start (intro until `addPause`)
- `onScreen === false` → resume past `addPause` for outro
- Put `#id` targets **inside** the `ref` scope (`useGSAP` only queries descendants)
- Fade the whole graphic with the `root` argument — an `#id` on the scoped node itself will not match
