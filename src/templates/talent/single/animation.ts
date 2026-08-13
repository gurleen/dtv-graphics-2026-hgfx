import gsap from 'gsap'
import '../../../lib/gsap'
import type { AnimationFunc } from '../../../lib/gsap'

export const talentSingleAnimation: AnimationFunc = (timeline, root) => {
  gsap.set('#text-box', { yPercent: 100 })
  gsap.set('#first-name', { yPercent: 100 })
  gsap.set('#last-name', { yPercent: 100 })

  timeline
    .to('#text-box', { yPercent: 0, duration: 0.62, ease: 'power3.out' }, 0)
    .to('#first-name', { yPercent: 0, duration: 1.4, ease: 'expo.out' }, 0.25)
    .to('#last-name', { yPercent: 0, duration: 1.4, ease: 'expo.out' }, 0.35)
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
