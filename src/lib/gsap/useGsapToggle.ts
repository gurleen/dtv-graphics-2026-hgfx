import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState, type DependencyList, type RefObject } from 'react'
import type { AnimationFunc } from './types'

/**
 * Nested / state-driven clip (port of dtv-graphics-2026 `useSubAnimation`).
 * Same intro → addPause() → outro shape; rebuilds when `deps` or `ready` change.
 * When `playing` flips relative to the last known state, calls `play()`.
 */
export function useGsapToggle(
  playing: boolean,
  animFunc: AnimationFunc,
  deps: DependencyList = [],
  ready = true,
): RefObject<HTMLDivElement | null> {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [wasPlaying, setWasPlaying] = useState(false)

  useGSAP(
    () => {
      if (!ready) return

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          tlRef.current?.seek(0).pause()
        },
      })
      animFunc(tl)
      tlRef.current = tl

      if (wasPlaying !== playing) {
        tl.play()
        setWasPlaying(playing)
      }

      return () => {
        tl.kill()
        tlRef.current = null
      }
    },
    { scope: scopeRef, dependencies: [...deps, ready] },
  )

  useEffect(() => {
    if (!ready) return
    if (wasPlaying === playing) return
    tlRef.current?.play()
    setWasPlaying(playing)
  }, [playing, ready, wasPlaying])

  return scopeRef
}
