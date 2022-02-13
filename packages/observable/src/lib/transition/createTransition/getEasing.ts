import { Easing } from '@pavel/easing'
import { TransitionTimingOptions } from '../types'
import { DEFAULT_EASING } from './constants'

export function getEasing(options: TransitionTimingOptions): Easing {
  if (typeof options === 'object' && options.easing) {
    return options.easing
  }

  return DEFAULT_EASING
}
