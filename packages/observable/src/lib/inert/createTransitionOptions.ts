import { TransitionOptions } from '../transition'
import { InertOptions } from './types'

export function createTransitionOptions(
  optionsOrDuration: InertOptions,
  initialValue: number,
): TransitionOptions {
  return typeof optionsOrDuration === 'number'
    ? {
        duration: optionsOrDuration,
        initialValue,
      }
    : { ...optionsOrDuration, initialValue }
}
