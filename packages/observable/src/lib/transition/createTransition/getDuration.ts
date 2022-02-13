import { TransitionTimingOptions } from '../types'

export function getDuration(
  optionsOrDuration: TransitionTimingOptions,
): number {
  if (typeof optionsOrDuration === 'number') {
    return optionsOrDuration
  }

  return optionsOrDuration.duration
}
