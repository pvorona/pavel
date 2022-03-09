import { Interpolate, createTransition, Transition } from '../transition'
import { createTransitionOptions } from './createTransitionOptions'
import { AnyAnimatableValue, InertOptions } from './types'

export const constructTransition = <T extends AnyAnimatableValue>(
  value: T,
  options: InertOptions,
  computeIntermediateValue: Interpolate<T>,
): Transition<T> => {
  const transitionOptions = createTransitionOptions(
    options,
    value,
    computeIntermediateValue,
  )

  return createTransition(transitionOptions)
}
