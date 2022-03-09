import {
  TransitionOptions,
  createTransitionTimingOptions,
  Interpolate,
} from '../transition'
import { AnyAnimatableValue, InertOptions } from './types'

export function createTransitionOptions<T extends AnyAnimatableValue>(
  optionsOrDuration: InertOptions,
  initialValue: T,
  computeIntermediateValue: Interpolate<T>,
): TransitionOptions<T> {
  return {
    ...createTransitionTimingOptions(optionsOrDuration),
    initialValue,
    computeIntermediateValue,
  }
}
