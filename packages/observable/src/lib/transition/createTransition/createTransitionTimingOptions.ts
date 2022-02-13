import { TransitionTimingOptions, TransitionTiming } from '../types'
import { getDuration } from './getDuration'
import { getEasing } from './getEasing'

export function createTransitionTimingOptions(
  optionsOrDuration: TransitionTimingOptions,
): TransitionTiming {
  return {
    duration: getDuration(optionsOrDuration),
    easing: getEasing(optionsOrDuration),
  }
}
