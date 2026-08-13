import gsap from 'gsap'
import '../../lib/gsap'
import type { AnimationFunc } from '../../lib/gsap'

export const scoreToBreakAnimation: AnimationFunc = (timeline, root) => {
  gsap.set('#away-row', { yPercent: 100 })
  gsap.set('#home-row', { yPercent: -100 })

  timeline
    .to('#away-row', { yPercent: 0, duration: 0.62, ease: 'power3.out' }, 0)
    .to('#home-row', { yPercent: 0, duration: 0.62, ease: 'power3.out' }, 0)
    .from('#away-logo', { xPercent: -100, duration: 1.6, ease: 'expo.out' }, 0.25)
    .from('#home-logo', { xPercent: -100, duration: 1.6, ease: 'expo.out' }, 0.25)
    .from('#away-score', { xPercent: 100, duration: 1.6, ease: 'expo.out' }, 0.35)
    .from('#home-score', { xPercent: 100, duration: 1.6, ease: 'expo.out' }, 0.35)
    .from('#bottom-bar', { y: -37, duration: 1.2, ease: 'expo.out' }, 0.8)
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
