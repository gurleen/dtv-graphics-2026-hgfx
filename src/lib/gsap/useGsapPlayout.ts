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
 * Put the returned ref on a wrapper that scopes `#id` selectors used in `animFunc`.
 */
export function useGsapPlayout(
  onScreen: boolean,
  animFunc: AnimationFunc,
  deps: DependencyList = [],
): RefObject<HTMLDivElement | null> {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          tlRef.current?.seek(0).pause()
        },
      })
      animFunc(tl)
      tlRef.current = tl
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
