import { Easing } from '@pavel/easing'
import { TransitionTimingOptionsObject } from '../types'
import { DEFAULT_EASING } from './constants'

export function getEasing(options: TransitionTimingOptionsObject): Easing {
  if (options.easing) {
    return options.easing
  }

  return DEFAULT_EASING
}
