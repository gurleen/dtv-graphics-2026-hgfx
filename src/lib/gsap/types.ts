import type gsap from 'gsap'

/**
 * Build an intro → addPause() → outro timeline.
 *
 * `root` is the scope element from `useGsapPlayout` / `useGsapToggle`.
 * Prefer `root` for fading the whole graphic — `#id` on the scoped element
 * itself is NOT found (GSAP scope only queries descendants).
 */
export type AnimationFunc = (
  timeline: gsap.core.Timeline,
  root: HTMLElement,
) => void
