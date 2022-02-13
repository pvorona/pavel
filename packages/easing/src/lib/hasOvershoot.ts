import { Easing, linear } from './easing'

const EASINGS_WITHOUT_OVERSHOOT = new Set([linear])

export function hasOvershoot(easing: Easing): boolean {
  return !EASINGS_WITHOUT_OVERSHOOT.has(easing)
}
