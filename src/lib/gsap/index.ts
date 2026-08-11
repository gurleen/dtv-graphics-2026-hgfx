import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export type { AnimationFunc } from './types'
export { useGsapPlayout } from './useGsapPlayout'
export { useGsapToggle } from './useGsapToggle'
