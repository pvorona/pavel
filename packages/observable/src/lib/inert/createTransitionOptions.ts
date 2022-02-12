import { TransitionOptions, createTransitionTimingOptions } from '../transition'
import { InertOptions } from './types'

export function createTransitionOptions(
  optionsOrDuration: InertOptions,
  initialValue: number,
): TransitionOptions {
  return { ...createTransitionTimingOptions(optionsOrDuration), initialValue }
}
