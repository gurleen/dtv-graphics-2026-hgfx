import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState, type DependencyList, type RefObject } from 'react'
import type { AnimationFunc } from './types'

export type GsapPlayout = {
  scope: RefObject<HTMLDivElement | null>
  /** True while the intro or outro is playing (false at rest and at `addPause`). */
  isAnimating: boolean
}

/**
 * SPX-style intro → addPause() → outro timeline, driven by HYDRA `onScreen`.
 *
 * - `onScreen === true`  → play from start (intro until `addPause`)
 * - `onScreen === false` → if past t=0, resume past `addPause` for outro
 * - onComplete           → seek(0).pause() for the next take
 *
 * Put `scope` on a wrapper that owns descendant `#id` selectors.
 * Fade the whole graphic with the `root` argument (not `#id` on the scoped node).
 */
export function useGsapPlayout(
  onScreen: boolean,
  animFunc: AnimationFunc,
  deps: DependencyList = [],
): GsapPlayout {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const onScreenRef = useRef(onScreen)
  onScreenRef.current = onScreen
  const [isAnimating, setIsAnimating] = useState(onScreen)
  const tickerRef = useRef<(() => void) | null>(null)

  const stopWatch = () => {
    if (tickerRef.current) {
      gsap.ticker.remove(tickerRef.current)
      tickerRef.current = null
    }
  }

  const watchPlaying = (tl: gsap.core.Timeline) => {
    stopWatch()
    setIsAnimating(true)
    const tick = () => {
      if (!tl.isActive()) {
        stopWatch()
        setIsAnimating(false)
      }
    }
    tickerRef.current = tick
    gsap.ticker.add(tick)
  }

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
      if (onScreenRef.current) {
        tl.play()
        watchPlaying(tl)
      }
      return () => {
        stopWatch()
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
      watchPlaying(tl)
    } else if (tl.time() > 0) {
      // Sitting at addPause (or mid-intro): resume to run the outro.
      tl.play()
      watchPlaying(tl)
    }
  }, [onScreen])

  return { scope: scopeRef, isAnimating }
}
