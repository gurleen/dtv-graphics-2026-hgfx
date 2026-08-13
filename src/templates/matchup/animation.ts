import '../../lib/gsap'
import type { AnimationFunc } from '../../lib/gsap'

const CAA_GLOW =
  'drop-shadow(0 0 6px #fff) drop-shadow(0 0 16px rgba(255,255,255,0.75)) drop-shadow(0 0 32px rgba(255,255,255,0.38))'
const CAA_GLOW_OFF =
  'drop-shadow(0 0 0px #fff) drop-shadow(0 0 0px rgba(255,255,255,0)) drop-shadow(0 0 0px rgba(255,255,255,0))'

export const matchupAnimation: AnimationFunc = (timeline, root) => {
  const paths = root.querySelectorAll('#caa-logo path')

  // Park these on the timeline at t=0 so the post-outro seek(0) restores a
  // blank frame — not the oversized glowing wordmark (ConfBox is overflow:visible).
  timeline
    .set('#caa-box', { autoAlpha: 0 })
    .set('#caa-ripple', {
      xPercent: -50,
      yPercent: -50,
      scale: 0.2,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
    })
    .set('#caa-logo', {
      autoAlpha: 0,
      scale: 1.75,
      y: -24,
      transformOrigin: '50% 50%',
      filter: CAA_GLOW,
    })
    .set(paths, {
      drawSVG: 0,
      fillOpacity: 0,
      stroke: '#FEFEFE',
      strokeWidth: 10,
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
    })
    .set('#away-box', { xPercent: 100 })
    .set('#home-box', { xPercent: -100 })
    .to('#caa-logo', { autoAlpha: 1, duration: 0.08, ease: 'none' })
    .to(
      paths,
      {
        drawSVG: '100%',
        duration: 1.15,
        stagger: { each: 0.14, from: 'end' },
        ease: 'power2.inOut',
      },
      '<',
    )
    .to(paths, { fillOpacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.28')
    .addLabel('slam', '+=0.08')
    .to(
      '#caa-logo',
      {
        scale: 0.98,
        y: 2,
        filter: CAA_GLOW_OFF,
        duration: 0.38,
        ease: 'power3.in',
      },
      'slam',
    )
    .to('#caa-box', { autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, 'slam')
    .to(paths, { strokeWidth: 0, duration: 0.2, ease: 'power1.out' }, 'slam')
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
      'slam+=0.36',
    )
    .to('#caa-logo', { scale: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 'slam+=0.44')
    // Ripple ring's leading edge hits the left/right of the plate ~0.10s in.
    .to('#away-box', { xPercent: 0, duration: 0.62, ease: 'power3.out' }, 'slam+=0.46')
    .to('#home-box', { xPercent: 0, duration: 0.62, ease: 'power3.out' }, 'slam+=0.46')
    .from('#home-logo', { xPercent: 100, duration: 2, ease: 'expo.out' }, 'slam+=0.71')
    .from('#away-logo', { xPercent: -100, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-school-name', { xPercent: -100, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-school-name', { xPercent: 100, duration: 2, ease: 'expo.out' }, '<')
    .from('#sponsor-bar', { y: 75, duration: 1.5, ease: 'expo.out' }, '<1')
    .from('#bottom-bar', { y: -75, duration: 1.5, ease: 'expo.out' }, '<')
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}
