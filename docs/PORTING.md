# Porting graphics from dtv-graphics-2026

Checklist for agents porting SPX / Bun graphics from the old show package into this HYDRA // GFX template package.

**Look:** follow [DESIGN_LANGUAGE.md](DESIGN_LANGUAGE.md) (established on matchup). Talent light panels are the exception.

**Reference ports:** [`src/templates/matchup`](../src/templates/matchup) for team-color / full-width bars; [`src/templates/talent/single`](../src/templates/talent/single) and [`src/templates/talent/double`](../src/templates/talent/double) for name plates.

## 1. Place files logically (no numbering)

Old: `src/graphics/9_talent_lower_third_single/…`  
New: `src/templates/<domain>/<variant>/` — e.g. `talent/single/`, `talent/double/`.

Drop numeric prefixes (`8_`, `9_`). Group by domain; put shared chrome in `shared/`.

Each template folder:

```
schema.ts      # zod + TemplateSchema (id, route, defaults, fields, transition)
Graphic.tsx    # default export render
Controls.tsx   # optional custom controls
```

## 2. Share code when layouts overlap

If two+ templates share panel chrome, colors, or name blocks, extract to `src/templates/<domain>/shared/` (see talent `TalentPanel`, `TopBox`, `TalentName`, `constants.ts`).

## 3. Replace SPX playout with HYDRA hooks

| Old | New |
|-----|-----|
| `useProps` / SPX | Zod schema + `TemplateRenderProps<Props>` |
| `useAnimation(animFunc)` | `useGsapPlayout(onScreen, animFunc)` from `src/lib/gsap` |
| `useSubAnimation` | `useGsapToggle` |
| `ReactDOM.createRoot` / HTML entry | Lazy `defineTemplate` in `src/index.ts` only |

Keep the **intro → `addPause()` → outro** timeline body; copy GSAP tweens and `#id` selectors for **descendants**. Put `ref={scope}` on a wrapper that owns those ids.

`useGSAP` scope only queries **inside** the ref element — an `#id` on the scoped node itself will not match (this caused `GSAP target #talent-root not found`). Fade the whole graphic with the second `root` argument instead:

```ts
function animation(tl: gsap.core.Timeline, root: HTMLElement) {
  tl.from('#text-box', { … })
    .addPause()
    .to(root, { opacity: 0, duration: 0.3 })
}
```

Runtime layout primitives (`Box`, `Column`, etc.) do **not** forward `id` — wrap GSAP targets in plain `<div id="…">`.

## 4. Replace layout stack

| Old | New |
|-----|-----|
| `AnimationContainer` | `HtmlCanvas` (+ `LowerThird` when appropriate) |
| Tailwind + local `Rect` | `@hydra-tv/hydra-gfx-runtime` (`Rect`, `Row`, `Column`, `Text`, `Image`, …) |
| Opaque page backgrounds | Transparent canvas only (OBS) |

## 5. Strip external systems

Remove hard-coded:

- `*.dragonstv.io` image / API / WebSocket URLs
- SPX API clients
- live-data / ObjectStore / SignalR wiring

Promote sponsor/logo/brand strings to **optional props** with empty or generic defaults (e.g. `logoUrl: ''`, `eyebrow: 'TALENT'`). Do not bake production CDN URLs into defaults.

Fonts: prefer a local stack like `Zuume, system-ui, sans-serif` (no font CDN). Host-provided faces named Zuume will pick up when present.

## 6. Wire the package

In [`src/index.ts`](../src/index.ts):

- Import **only** `*TemplateSchema` objects (eager).
- Register with `defineTemplate({ ...schema, Render: () => import('…'), Controls: () => import('…') })`.
- Never eager-import `Graphic.tsx` into the package entry.

`gsap` / `@gsap/react` stay **out of** `hydra.config.ts` `shared` (bundled into `.hgfx.js`).

## 7. Verify

```bash
bun run build
# → dist/dtv-2026.hgfx.js
```

Preview after install into a host:

```
/graphics/p/dtv-2026/<templateId>?preview=1
```

Talent examples:

- `/graphics/p/dtv-2026/talent-single?preview=1`
- `/graphics/p/dtv-2026/talent-double?preview=1`
