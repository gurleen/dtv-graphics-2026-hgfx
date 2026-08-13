import gsap from 'gsap'
import '../../lib/gsap'
import type { AnimationFunc } from '../../lib/gsap'

const CAA_GLOW =
  'drop-shadow(0 0 8px #fff) drop-shadow(0 0 22px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(255,255,255,0.5))'
const CAA_GLOW_OFF =
  'drop-shadow(0 0 0px #fff) drop-shadow(0 0 0px rgba(255,255,255,0)) drop-shadow(0 0 0px rgba(255,255,255,0))'

export const matchupAnimation: AnimationFunc = (timeline, root) => {
  const paths = root.querySelectorAll('#caa-logo path')

  gsap.set('#caa-box', { autoAlpha: 0 })
  gsap.set('#caa-ripple', {
    xPercent: -50,
    yPercent: -50,
    scale: 0.2,
    autoAlpha: 0,
    transformOrigin: '50% 50%',
  })
  gsap.set('#caa-logo', {
    scale: 1.75,
    y: -24,
    transformOrigin: '50% 50%',
    filter: CAA_GLOW,
  })
  gsap.set(paths, {
    drawSVG: 0,
    fillOpacity: 0,
    stroke: '#FEFEFE',
    strokeWidth: 10,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  })

  timeline
    .to(paths, {
      drawSVG: '100%',
      duration: 1.15,
      stagger: { each: 0.14, from: 'end' },
      ease: 'power2.inOut',
    })
    .to(paths, { fillOpacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.28')
    .to(
      '#caa-logo',
      {
        scale: 0.98,
        y: 2,
        filter: CAA_GLOW_OFF,
        duration: 0.38,
        ease: 'power3.in',
      },
      '+=0.08',
    )
    .to('#caa-box', { autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, '<')
    .to(paths, { strokeWidth: 0, duration: 0.2, ease: 'power1.out' }, '<')
    .fromTo(
      '#caa-ripple',
      { scale: 0.25, autoAlpha: 0.9 },
      {
        scale: 2.35,
        autoAlpha: 0,
        duration: 0.72,
        ease: 'power2.out',
        immediateRender: false,
      },
      '<0.36',
    )
    .to('#caa-logo', { scale: 1, y: 0, duration: 0.18, ease: 'power2.out' }, '<0.08')
    .from('#home-box', { y: 189, duration: 2, ease: 'expo.out' }, '>-0.02')
    .from('#away-box', { y: 189, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-logo', { xPercent: 100, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-logo', { xPercent: -100, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-school-name', { y: 75, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-school-name', { y: 75, duration: 2, ease: 'expo.out' }, '<')
    .from('#sponsor-bar', { y: 75, duration: 1.5, ease: 'expo.out' }, '<1')
    .from('#bottom-bar', { y: -75, duration: 1.5, ease: 'expo.out' }, '<')
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
