import gsap from 'gsap'
import '../../../lib/gsap'
import type { AnimationFunc } from '../../../lib/gsap'

export const talentDoubleAnimation: AnimationFunc = (timeline, root) => {
  gsap.set('#text-box', { yPercent: 100 })
  gsap.set('#left-first-name', { xPercent: 100 })
  gsap.set('#left-last-name', { xPercent: 100 })
  gsap.set('#right-first-name', { xPercent: -100 })
  gsap.set('#right-last-name', { xPercent: -100 })
  gsap.set('#top-box', { yPercent: 100 })

  timeline
    .to('#text-box', { yPercent: 0, duration: 0.62, ease: 'power3.out' }, 0)
    .to('#left-first-name', { xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0.25)
    .to('#left-last-name', { xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0.35)
    .to('#right-first-name', { xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0.25)
    .to('#right-last-name', { xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0.35)
    .to('#top-box', { yPercent: 0, duration: 1.2, ease: 'expo.out' }, 0.8)
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
