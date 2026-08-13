---
name: dtv-graphics-design-language
description: >-
  Applies the DTV 2026 matchup design language when creating, porting, or
  restyling HYDRA graphics in this package. Use when adding or porting a
  template, building a score bug / matchup / lower-third bar, choosing colors
  fonts sheen logos or intro motion, or when the user mentions design language,
  look and feel, or matching the matchup graphic.
---

# DTV 2026 design language

This package's look was set on the matchup graphic. New and ported templates must follow it unless the user explicitly wants a different family (e.g. talent's light panels).

## Required reading

Read [docs/DESIGN_LANGUAGE.md](../../../docs/DESIGN_LANGUAGE.md) before writing layout, type, color, sheen, or intro animation. Reference implementation: `src/templates/matchup/Layout.tsx` and `src/templates/matchup/animation.ts`.

Also follow [docs/PORTING.md](../../../docs/PORTING.md) for HYDRA / GSAP wiring (not look).

## Workflow

1. Classify the graphic:
   - **Matchup family** — full-width bars, team-color plates, score bugs, conference chrome → apply the design language in full.
   - **Talent family** — light name panels (`src/templates/talent/shared/constants.ts`) → keep that inverted palette; still use Zuume, knockout CAA SVG, and GSAP intro/`addPause`/outro.
2. Copy structure from matchup: `schema.ts` + `Graphic.tsx` + `Layout.tsx` + `animation.ts` + `Showcase.tsx`. Do not inline a one-off visual system. Register in `src/templates/registry.ts` and `src/templates/showcaseRegistry.ts` (tabs on the stakeholder page come from the registry).
3. Reuse tokens from the doc (font, fills, sheen CSS, logo scale 1.8, name wrap at 12 chars, knockout logos). Do not invent a second sheen or type stack.
4. Motion: clipped transforms, energy from the center outward. Never `scaleX` a plate to reveal it.
5. Park full-width bars with `position: absolute` (matchup uses `top: 700`), not `marginTop`.

## Checks before finishing

- [ ] Zuume, all-caps on team/venue/presenter copy
- [ ] Dark plates `#141414` / `#141515`; team plates `team.color`; light footer `#F0F0F0`
- [ ] Dark or light `ShapeSheen` on every plate
- [ ] Knockout logos via `getTeamKnockoutLogo` + `CroppedImage`
- [ ] `#id`s on `<div>`s; `useGsapPlayout`; outro fades `root`
- [ ] Schema `inMs` / `outMs` match the timeline
- [ ] `Showcase.tsx` exists and is registered in `src/templates/showcaseRegistry.ts` (keys match `templateRegistry`)
