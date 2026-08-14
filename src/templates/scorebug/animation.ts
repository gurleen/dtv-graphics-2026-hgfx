import gsap from 'gsap'
import '../../lib/gsap'
import type { AnimationFunc } from '../../lib/gsap'

export const scorebugAnimation: AnimationFunc = (timeline, root) => {
  gsap.set('#away-box', { xPercent: -100 })
  gsap.set('#home-box', { xPercent: 100 })
  gsap.set('#info-box', { yPercent: -40, opacity: 0 })
  gsap.set('#sub-bar', { yPercent: -100 })

  timeline
    .to('#away-box', { xPercent: 0, duration: 0.55, ease: 'power3.out' }, 0)
    .to('#home-box', { xPercent: 0, duration: 0.55, ease: 'power3.out' }, 0)
    .to('#info-box', { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, 0.12)
    .to('#sub-bar', { yPercent: 0, duration: 0.4, ease: 'power3.out' }, 0.32)
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
