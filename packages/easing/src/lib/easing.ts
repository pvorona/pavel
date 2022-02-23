import { bezier } from './bezier'
import { Easing } from './types'

export const special: Easing = bezier(0.6, 0, 0.15, 1)
export const linear: Easing = t => t
export const easeIn: Easing = t => t ** 1.675
export const easeOut: Easing = t => 1 - (1 - t ** 1.675)
export const easeInOut: Easing = t => 0.5 * (Math.sin((t - 0.5) * Math.PI) + 1)
export const easeInQuad: Easing = t => t * t
export const easeOutQuad: Easing = t => t * (2 - t)
export const easeInOutQuad: Easing = t =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
export const easeInCubic: Easing = t => t * t * t
export const easeOutCubic: Easing = t => --t * t * t + 1
export const easeInOutCubic: Easing = t =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
export const easeInQuart: Easing = t => t * t * t * t
export const easeOutQuart: Easing = t => 1 - --t * t * t * t
export const easeInOutQuart: Easing = t =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
export const easeInQuint: Easing = t => t * t * t * t * t
export const easeOutQuint: Easing = t => 1 + --t * t * t * t * t
export const easeInOutQuint: Easing = t =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
