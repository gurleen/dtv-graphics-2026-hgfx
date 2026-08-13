# DTV 2026 design language

Canonical look for this package. It was established on the **matchup** graphic (`src/templates/matchup/`). Apply it when porting or creating templates so the package reads as one show, not a pile of one-offs.

**Reference implementation:** [`src/templates/matchup/Layout.tsx`](../src/templates/matchup/Layout.tsx) and [`src/templates/matchup/animation.ts`](../src/templates/matchup/animation.ts).

Talent lower thirds (`src/templates/talent/`) use a related but inverted palette (light panel, dark ink). Prefer matchup language for **scoreboard, bug, full-width bar, and team-color** graphics.

## Principles

1. **Plates, not cards.** Graphics are stacked full-width bars (or stacked team plates) with hard edges. No rounded corners, no drop-shadow under the whole graphic, no glass blur.
2. **Team color is the fill.** Knockout (white) logos and white type sit on `team.color`. Empty / conference / chrome plates use near-black, not team color.
3. **Mirror the matchup.** Home is the away layout flipped: logo on the outer edge, name facing the conference plate. Do not stack both names the same way.
4. **Sheen every plate.** Every filled rectangle gets an inset highlight/shadow so it reads as painted metal, not a flat CSS box.
5. **Type is Zuume, all caps, tight.** Tracking on school names and ghost tickers is `0.08em`. No sentence case on team or venue copy.
6. **Motion is clipped transforms.** Reveal by sliding plates through `overflow: hidden` wrappers (`xPercent` / `y`). Do not squash with `scaleX`. Energy comes from the center and radiates out.
7. **Foreground sits above texture.** Ghost mascot tickers and sheen are `z-index: 0`. Logos and names sit in a content layer with a dark text/drop shadow so they stay readable.

## Frame and geometry

| Token | Value |
| --- | --- |
| Canvas | 1920 × 1080, transparent (`HtmlCanvas`) |
| Matchup width | 1920 |
| Vertical park | `position: absolute; top: 700; left: 0` (not `marginTop` — margin collapses through the host preview wrapper) |
| Sponsor bar height | 72 |
| Team / conference row | 189 |
| Bottom bar height | 61 |
| Total stack | 322 |
| Conference box min width | 120 (remainder of 1920 after both team boxes) |
| Name column | 260 wide, 20px horizontal padding |
| Logo clip height | 189 |
| Logo content size | 300 × 189, then scaled |
| Default logo scale | **1.8** |

Use `top: 700` (or an equivalent absolute park) for full-width lower-third bars so they sit in the lower third of the 1080 frame.

## Color

| Role | Hex | Use |
| --- | --- | --- |
| Sponsor chrome | `#141414` | Presenter / sponsor bar |
| Conference / empty team | `#141515` | CAA plate; missing-team fill |
| Team fill | `team.color` (`#` prefixed if needed) | Home / away plates |
| Light footer | `#F0F0F0` | Venue / location bar |
| Ink on dark | `#FFFFFF` | Presenter, school names, CAA wordmark |
| Ink on light | `#000000` | Venue line |
| Ghost ticker | `rgba(255,255,255,0.08)` | Mascot repeat behind the team plate |
| CAA stroke / fill | `#FEFEFE` | Wordmark draw-in |

Talent panels stay on `#D3D1D1` / `#131313` (see `src/templates/talent/shared/constants.ts`). Do not mix those fills into matchup-family bars.

## Type

Stack: `Zuume, system-ui, sans-serif`. Host-provided Zuume faces pick up when present; do not load a font CDN.

| Role | Size | Weight | Tracking | Color |
| --- | --- | --- | --- | --- |
| School name | 72 | 800 | `0.08em` | `#FFFFFF` |
| Presenter | 48 | default | — | `#FFFFFF` |
| Venue line | 48 | default | — | `#000000` |
| Mascot ticker | ~180 (`189 * 0.95`) | 800 | `0.08em` | `rgba(255,255,255,0.08)` |

- All copy in these bars is **uppercase**.
- School names wrap after **12 characters**, at the last space that still fits on the first line (`NORTH CAROLINA` → `NORTH` / `CAROLINA`). One-word names stay on one line.
- Each school-name line is `singleLine`. Line height on stacked names is `1`.
- Venue format: `VENUE • LOCATION` (bullet, not hyphen).

## Material (sheen)

Every plate is a `position: relative` shell. Sheen is an absolutely inset overlay (`pointer-events: none`, `z-index: 0`). Content is `position: relative; z-index: 1`.

**Dark plates** (sponsor, conference, team):

```css
background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 28%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.22) 100%);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.28);
```

**Light plates** (footer):

```css
background: linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.02) 32%, rgba(20,40,60,0.06) 100%);
box-shadow: inset 0 1px 0 rgba(0,0,0,0.12), inset 0 -1px 0 rgba(255,255,255,0.35);
```

Reuse this treatment rather than inventing a new gradient per template.

**Foreground on team color:**

```css
text-shadow: 0 1px 6px rgba(0,0,0,0.55);
filter: drop-shadow(0 1px 4px rgba(0,0,0,0.45)); /* logos */
```

## Imagery

- Team marks: **knockout** PNGs via `getTeamKnockoutLogo` (`https://images.dragonstv.io/logos-knockout/…`). Color logos are for other contexts.
- Clip with `CroppedImage`: `fit="cover"`, default `scale={1.8}`, `contentWidth={300}` / `contentHeight={189}` inside a 189-tall clip so scale > 1 still shows a full-width mark.
- Conference wordmark: white CAA SVG (`src/templates/talent/shared/assets/caa-white.svg`). Inject the SVG **once** into the DOM (not `dangerouslySetInnerHTML` on every render) so DrawSVG path nodes survive IN/OUT re-renders.
- Sponsor: Independence lockup by default; optional URL override. `fit="contain"` in the sponsor bar (400 × 48 on matchup).

## Texture: mascot ticker

Behind each team plate, a looping marquee of the mascot in ghost type. It scrolls **outward** (away → left, home → right) so motion agrees with the mirror layout. Duplicate the copy strip for a seamless loop. Keep it `aria-hidden` and below the sheen/content stack.

## Motion

Timeline contract: intro → `addPause()` → outro (`useGsapPlayout`). Fade the whole graphic with the timeline `root`, not an `#id` on the scoped node. Keep `#id` targets on plain `<div>`s (runtime `Row` / `Column` do not forward `id`).

Matchup intro grammar (reuse the *shape*, not necessarily the timings, on related bars):

1. **Hero mark draws in** oversized, stroked, glowing; fill comes up as the stroke finishes.
2. **Slam** into the plate (`power3.in` into a short settle). Conference plate fades up on the slam.
3. **Ripple** on the plate background: radial ring, delayed until the slam has landed; team plates wait until the ring hits the plate edge.
4. **Plates push middle-out** (`away` from `xPercent: 100`, `home` from `xPercent: -100`) through overflow clips. Punchy `power3.out` (~0.6s), not a 2s drift.
5. **Logos from the outside, names from the inside** (`expo.out`, longer). They meet in the name column.
6. **Chrome bars last** — sponsor drops down, footer rises up.
7. **Outro** is a 0.5s `expo.out` fade of `root`.

CAA draw-in glow:

```css
drop-shadow(0 0 8px #fff)
drop-shadow(0 0 22px rgba(255,255,255,0.9))
drop-shadow(0 0 40px rgba(255,255,255,0.5))
```

Park rest poses with `gsap.set` before the timeline plays so a post-outro `seek(0)` does not flash the oversized glowing mark.

Matchup `transition`: `{ inMs: 4200, outMs: 500 }` — keep schema `inMs` / `outMs` honest to the timeline.

## Layout architecture (copy this)

```
Column 1920
  overflow:hidden → SponsorBar (#141414 + dark sheen)
  Row 1920 × 189
    overflow:hidden → Away TeamBox (team color, logo | name)
    ConfBox (overflow visible for the oversized mark; inner #caa-box clips the ripple)
    overflow:hidden → Home TeamBox (name | logo, row-reverse)
  overflow:hidden → BottomBar (#F0F0F0 + light sheen)
```

Split **layout** (`Layout.tsx`) from **timeline** (`animation.ts`) from **HYDRA wiring** (`Graphic.tsx` + `schema.ts`).

## Do / don't

**Do**

- Clip motion with wrappers; animate `x` / `xPercent` / `y`.
- Share sheen, font, knockout logos, and name wrapping across new team plates.
- Iterate intros on `demos/` with IN / OUT driving `onScreen`.

**Don't**

- Introduce a second display face, rounded plates, or outer drop shadows.
- Put color logos on team-color fills.
- Rebuild SVG markup on every take-in (breaks DrawSVG).
- Use `marginTop` to park a full-width bar in `HtmlCanvas`.
