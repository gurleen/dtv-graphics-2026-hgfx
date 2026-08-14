---
name: port-dtv-graphic
description: >-
  Ports a named graphic from gurleen/dtv-graphics-2026 into this HYDRA
  package (dtv-graphics-2026-hgfx), restyled to the DTV 2026 design language.
  Use when the user names an old-repo graphic (folder like 10_player_lower_third
  or titles like player lower third, coming up next, conf standings, PWE) and
  asks to port, implement, recreate, or bring it over. After every visual
  iteration, screenshots the local showcase via browser MCP for user verification.
---

# Port a DTV graphic from the old repo

Input: the name of a graphic in [gurleen/dtv-graphics-2026](https://github.com/gurleen/dtv-graphics-2026). Output: a working HYDRA template in **this** package, verified with a browser screenshot after each visual pass.

Do not stop at "implemented in code." A screenshot of the IN state is required before asking the user to review.

## Required reading (do this first)

1. This file.
2. [graphics-catalog.md](graphics-catalog.md) — resolve the name, skip already-ported templates.
3. [dtv-graphics-design-language](../dtv-graphics-design-language/SKILL.md) and [docs/DESIGN_LANGUAGE.md](../../../docs/DESIGN_LANGUAGE.md).
4. [docs/PORTING.md](../../../docs/PORTING.md) — file layout, GSAP, registry wiring.

Copy structure from `src/templates/matchup/` (matchup family) or `src/templates/talent/single/` (talent family). Do not invent a second visual system.

## 1. Resolve the graphic

Match the user's string to an old folder using [graphics-catalog.md](graphics-catalog.md) (folder, suggested id, or alias). If two could match, pick the closest and state it.

If it is already ported, say so and stop unless they asked to change it.

If it is `0_lower_third`, refuse — that is a test square, not a show graphic.

## 2. Locate old source

Need `src/graphics/<folder>/` from the old repo (`.tsx` layout + animation; ignore `.html` SPX shells).

Search in order; stop at the first hit:

1. `<workspace>/../dtv-graphics-2026`
2. `$HOME/Developer/dtv-graphics-2026`
3. Clone (do **not** add as a submodule or commit the clone):

```bash
gh repo clone gurleen/dtv-graphics-2026 /tmp/dtv-graphics-2026
```

If `gh` cannot clone (private, no auth), fetch the folder with `gh api` / `WebFetch` against `https://github.com/gurleen/dtv-graphics-2026`. Do not guess layout from memory.

Read the old graphic's props, layout, and `animation()` timeline. Port the **on-air plate**, not live-data plumbing.

## 3. Implement

Follow [docs/PORTING.md](../../../docs/PORTING.md). Checklist:

- Folder: `src/templates/<domain>/` (no numeric prefix). Shared chrome → `shared/`.
- Files: `schema.ts`, `Layout.tsx`, `animation.ts`, `Graphic.tsx`, `Showcase.tsx`. Add `Controls.tsx` only for operator actions (clock start/stop, score bumpers) that a generic field sheet cannot do.
- Register: `templateRegistry` (lazy `Render`), `defineTemplate` in `src/index.ts`, `showcaseRegistry` (keys must match), README templates table.
- Schema: Zod props, defaults, `fields`, `transition.inMs` / `outMs` matching the timeline. Route `/graphics/p/dtv-2026/<id>`.
- `useGsapPlayout` + intro → `addPause()` → outro fades `root` (not `#id` on the scoped node). `#id`s on plain `<div>`s inside the ref.
- `HtmlCanvas` in `Graphic.tsx` only. Park full-width bars with `position: absolute` (matchup uses `top: 700`), not `marginTop`.
- Strip `*.dragonstv.io`, SPX, SignalR, ObjectStore. Promote names/scores/URLs to props with empty or generic defaults. No font CDNs — `Zuume, system-ui, sans-serif`.
- Default logo scale **1.8**, slider `min: 0.8`, `max: 3.5`, `step: 0.05`.
- Showcase: Layout + GSAP + `PlayoutSwitch` / `ShowcaseStage` from `src/templates/shared/ShowcaseChrome.tsx`. No `HtmlCanvas`. Sample teams from `src/templates/shared/showcaseSample.ts`.
- Base graphic only unless the user asked for nested clips (`useGsapToggle`). Skip old sub-sliders (TextSlider, PlayerSlider, …) on first port.
- `bun run build` must succeed before the first screenshot.

Family: **matchup** (team-color bars, bugs, standings) vs **talent** (light name panels). Player/coach/PWE lower thirds are talent-adjacent — reuse talent chrome where it fits; do not paste matchup fills onto a name plate.

## 4. Screenshot loop (required every visual iteration)

After the first build that includes the new Showcase, and again after **every** layout/color/motion/copy change:

### Demo server

```bash
bun run demo
# http://127.0.0.1:3456/showcase#<templateId>
```

Reuse an already-running demo on port 3456. If none, start `bun run demo` in the background. Do not change `demos/server.ts` bind address unless the browser cannot reach 127.0.0.1.

Wait until the server prints the showcase URL.

### Browser MCP

Discover tools (`GetMcpTools` pattern `browser`). Prefer **`cursor-ide-browser`** (cloud agents and Cursor's built-in tab). Fall back to **`user-browsermcp`** only when that server is the one that can see this machine's localhost.

| | cursor-ide-browser | user-browsermcp |
| --- | --- | --- |
| Open | `browser_navigate` | `browser_navigate` |
| Lock | `browser_lock` after navigate (unlock when fully done) | — |
| Wait | short CDP/`browser_snapshot` polls; wait ≥ `inMs` + 500ms | `browser_wait` seconds |
| Shot | `browser_take_screenshot` | `browser_screenshot` |
| Click | `browser_snapshot` then `browser_click` | same |

Do **not** use `GenerateImage` or describe the graphic instead of a screenshot. Do **not** screenshot the host HYDRA preview unless the showcase is unavailable.

### Capture

1. Navigate to `http://127.0.0.1:3456/showcase#<templateId>`.
2. The showcase passes `autoIn` — the graphic should play in. If you see OUT / empty stage, toggle the IN switch, then wait for the intro to finish (`transition.inMs`).
3. Take a screenshot of the page (full tab is fine; the stage must be visible).
4. Put that screenshot in the user-facing reply. State the URL and template id. Ask whether to keep iterating.
5. On each revision: save → wait for HMR or reload the same URL → wait for intro → screenshot again → show the new image. Never ask "does it look right?" without a new shot.

If the browser cannot open 127.0.0.1 (typical when `user-browsermcp` is on a different machine than a cloud VM), say so, switch to `cursor-ide-browser` if present, and only then report a blocker. Do not skip the screenshot step silently.

## 5. Stop conditions

- User approves the look, or
- User redirects (different graphic, stop porting).

Do not commit or push unless they ask. Do not port extra graphics in the same turn.

## Example

User: `10_player_lower_third`

1. Catalog → not ported, talent-adjacent, id `player-lower-third`.
2. Read old `src/graphics/10_player_lower_third/`.
3. Implement `src/templates/player-lower-third/`, register, `bun run build`.
4. `bun run demo` → screenshot `http://127.0.0.1:3456/showcase#player-lower-third` after IN.
5. Iterate from feedback with a new screenshot each time.
