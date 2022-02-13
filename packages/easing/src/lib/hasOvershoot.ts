import { Easing, linear, special } from './easing'

const EASINGS_WITHOUT_OVERSHOOT = new Set([linear, special])

export function hasOvershoot(easing: Easing): boolean {
  return !EASINGS_WITHOUT_OVERSHOOT.has(easing)
}
