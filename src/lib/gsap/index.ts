import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(useGSAP, DrawSVGPlugin)

export type { AnimationFunc } from './types'
export { useGsapPlayout, type GsapPlayout } from './useGsapPlayout'
export { useGsapToggle } from './useGsapToggle'
