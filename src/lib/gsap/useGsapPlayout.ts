import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, type DependencyList, type RefObject } from 'react'
import type { AnimationFunc } from './types'

/**
 * SPX-style intro → addPause() → outro timeline, driven by HYDRA `onScreen`.
 *
 * - `onScreen === true`  → play from start (intro until `addPause`)
 * - `onScreen === false` → if past t=0, resume past `addPause` for outro
 * - onComplete           → seek(0).pause() for the next take
 *
 * Put the returned ref on a wrapper that owns descendant `#id` selectors.
 * Fade the whole graphic with the `root` argument (not `#id` on the scoped node).
 */
export function useGsapPlayout(
  onScreen: boolean,
  animFunc: AnimationFunc,
  deps: DependencyList = [],
): RefObject<HTMLDivElement | null> {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const onScreenRef = useRef(onScreen)
  onScreenRef.current = onScreen

  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          tlRef.current?.seek(0).pause()
        },
      })
      animFunc(tl, root)
      tlRef.current = tl
      // If the timeline was rebuilt while already on-screen (e.g. prop deps),
      // the onScreen effect won't re-fire — resume IN immediately.
      if (onScreenRef.current) tl.play()
      return () => {
        tl.kill()
        tlRef.current = null
      }
    },
    { scope: scopeRef, dependencies: deps },
  )

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return

    if (onScreen) {
      if (tl.progress() === 1) tl.restart()
      else if (tl.time() === 0) tl.play()
      else tl.play()
    } else if (tl.time() > 0) {
      // Sitting at addPause (or mid-intro): resume to run the outro.
      tl.play()
    }
  }, [onScreen])

  return scopeRef
}
