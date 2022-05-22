import { Interpolate, createTransition, Transition } from '../transition'
import { ObservedTypeOf } from '../types'
import { createTransitionOptions } from './createTransitionOptions'
import { AnimatableSubject, InertOptions } from './types'

export const constructTransition = <T extends AnimatableSubject<unknown>>(
  value: ObservedTypeOf<T>,
  options: InertOptions<T>,
  interpolate: Interpolate<ObservedTypeOf<T>>,
): Transition<ObservedTypeOf<T>> => {
  const transitionOptions = createTransitionOptions(options, value, interpolate)

  return createTransition(transitionOptions)
}
