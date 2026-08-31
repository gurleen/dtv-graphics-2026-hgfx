# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A HYDRA // GFX template package (Drexel Athletics broadcast graphics) that compiles to a single `dist/dtv-2026.hgfx.js` artifact via `@hydra-tv/hydra-gfx-sdk`, installed into a HYDRA host (`dtv-graphics-2027`). Requires Bun >= 1.1.

## Commands

```bash
bun install
bun run build              # → dist/dtv-2026.hgfx.js
bun run watch               # rebuild on change
bunx hydra-gfx build --watch --out /path/to/dtv-graphics-2027/data/packages  # rebuild straight into a local host checkout

bun run demo                 # dev scroll page + stakeholder showcase at http://127.0.0.1:3456/
bun run build:showcase       # → showcase-dist/
bun run deploy:showcase      # build + deploy showcase to Cloudflare Pages
```

There is no test suite or linter configured in `package.json` — verification is `bun run build` succeeding plus visual check via `bun run demo` or an installed host preview (`/graphics/p/dtv-2026/<templateId>?preview=1`).

## Architecture

**Package entry** (`src/index.ts`) calls `definePackage()` with package-level config schema, shared basketball data schema, a `settings` panel, and `templates: Object.values(templates)` where `templates` eagerly maps every `TemplateId` through `defineTemplate(templateRegistry.<id>)`. The `satisfies { [K in TemplateId]: ... }` constraint means **adding a template only here, without an entry in `registry.ts`, fails to compile** — always wire both.

**`src/templates/registry.ts`** is the source of truth for templates: each entry spreads a template's `schema.ts` (id, route, defaults, fields, transition — eager) plus lazy `Render` / `Controls` / `PreviewControls` imports. Never eager-import a `Graphic.tsx` here.

**`src/templates/showcaseRegistry.ts`** is a *separate* lazy-loaded registry for the stakeholder showcase (`Showcase.tsx` per template). It's kept out of `registry.ts` so the showcase/demo chrome doesn't get bundled into the `.hgfx.js` artifact, and it's type-checked against `registry.ts`'s keys — a template missing a `Showcase` (or vice versa) fails to compile.

**Per-template folder convention** (`src/templates/<domain>/<variant>/`, no numeric prefixes):
```
schema.ts      # zod schema + TemplateSchema: id, route, defaults, fields, transition
Graphic.tsx    # default export render, wrapped in HtmlCanvas, used by the real package
Layout.tsx     # pure visual layout, shared by Graphic.tsx and Showcase.tsx
animation.ts   # GSAP intro / addPause() / outro timeline
Showcase.tsx   # stakeholder + demo preview: Layout + GSAP + IN/OUT chrome, no HtmlCanvas
Controls.tsx   # optional custom on-air controls
```
Code shared across variants of a domain (e.g. talent single/double) goes in `<domain>/shared/`.

**GSAP playout** (`src/lib/gsap`): `useGsapPlayout(onScreen, animFunc, deps?)` drives the main take/lose using an intro → `addPause()` → outro timeline; `onScreen === true` plays from start, `onScreen === false` resumes past the pause for outro. `useGsapToggle` handles nested state-driven clips. `gsap` and `@gsap/react` are bundled dependencies — keep them **out of** `hydra.config.ts`'s `shared` array (which lists packages the host provides, e.g. `react`, `@hydra-tv/*`, `zod`).

Key GSAP gotcha: `useGSAP`'s scope only queries **descendants** of the `ref` element, so an `#id` on the scoped node itself won't match — fade the whole graphic via the animation function's `root` argument instead of an `#id` selector on it. Runtime layout primitives (`Box`, `Column`, etc.) don't forward `id`, so wrap GSAP targets in plain `<div id="...">`.

**Full-width bars/panels**: position with `style={{ position: 'absolute', top, left, width }}`, not `marginTop` — margin-top collapses through `HtmlCanvas` into the host preview scale wrapper and the graphic renders below the visible monitor well.

**Data layer**: `src/data/teams.ts` (+ `teams.json`) provides `findTeam`, `DREXEL_TEAM_ID`, and knockout logo lookup (`getTeamKnockoutLogo`). `src/data/basketball.ts` defines the shared basketball game/overrides zod schemas used by package config and live binding. `src/config.ts` defines `Sport`/`SPORTS` and package-level config schema/defaults/fields.

**Live binding**: a template's `schema.ts` can declare `live.bind` mapping template props to package config paths (e.g. `sport: 'config.sport'`) so the host can drive props from live data.

## Design language (required for new/ported graphics)

Full spec in `docs/DESIGN_LANGUAGE.md`; reference implementation is `src/templates/matchup/`. Summary (also enforced by `.cursor/rules/dtv-graphics-design-language.mdc` for `src/templates/**`):

- Hard-edged plates with inset sheen, no rounded corners.
- Zuume font, all caps; school names wrap at 12 characters.
- Team color fill + knockout logos via `getTeamKnockoutLogo`, default logo scale **1.8**.
- Chrome colors `#141414` / `#141515`; footer `#F0F0F0`.
- Motion: clipped `xPercent` / `y`, middle-out energy — never squash with `scaleX`.
- Talent light panels (`src/templates/talent/`) are the one exception: inverted palette, but still Zuume + the GSAP take contract.

## Porting graphics from the old SPX-based show package

See `docs/PORTING.md` for the full checklist. Key mappings when porting:

| Old (SPX / dtv-graphics-2026) | New (this package) |
|---|---|
| `useProps` | Zod schema + `TemplateRenderProps<Props>` |
| `useAnimation(animFunc)` | `useGsapPlayout(onScreen, animFunc)` |
| `useSubAnimation` | `useGsapToggle` |
| `ReactDOM.createRoot` / HTML entry | Lazy `Render` in `templateRegistry`, mapped in `src/index.ts` |
| `AnimationContainer` | `HtmlCanvas` (+ `LowerThird` where appropriate) |
| Tailwind + local `Rect` | `@hydra-tv/hydra-gfx-runtime` primitives (`Rect`, `Row`, `Column`, `Text`, `Image`, …) |
| Opaque backgrounds | Transparent canvas only (composited over video in OBS) |

Strip hard-coded `*.dragonstv.io` URLs, SPX API clients, and live-data/ObjectStore/SignalR wiring; promote sponsor/logo/brand strings to optional props with empty/generic defaults rather than baked-in production CDN URLs. There's also a `.cursor/skills/port-dtv-graphic/` skill with a graphics catalog for this workflow.

## Notable gotchas

- `hydra.config.ts` `shared` lists host-provided packages excluded from the bundle — do not add `gsap`/`@gsap/react` there.
- The showcase (`demos/`) and the real package share `Layout.tsx`/`animation.ts` but never `Graphic.tsx`'s `HtmlCanvas` wrapper — `Showcase.tsx` re-implements the IN/OUT chrome standalone.
