import { TransitionOptions, Interpolate } from '../transition'
import { ObservedTypeOf } from '../types'
import { AnimatableSubject, InertOptions } from './types'

export function createTransitionOptions<T extends AnimatableSubject<unknown>>(
  options: InertOptions<T>,
  initialValue: ObservedTypeOf<T>,
  interpolate: Interpolate<ObservedTypeOf<T>>,
): TransitionOptions<ObservedTypeOf<T>> {
  return {
    ...options,
    initialValue,
    interpolate,
  }
}
