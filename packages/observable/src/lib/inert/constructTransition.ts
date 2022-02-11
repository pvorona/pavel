import { createGroupTransitionV3, createGroupTransition,createTransitionV3,createTransition } from '../transition'
import { createTransitionOptions } from './createTransitionOptions'
import { createTransitions } from './createTransitions'
import { AnimatableCollection, AnimatableValue, InertOptions } from './types'

export const constructTransition = (
  value: AnimatableValue | AnimatableCollection,
  options: InertOptions,
) => {
  if (typeof value === 'object') {
    const transitions = createTransitions(value, options)

    // return createGroupTransition(transitions)
    return createGroupTransitionV3(transitions)
  }

  const transitionOptions = createTransitionOptions(options, value)

  // return createTransition(transitionOptions)
  return createTransitionV3(transitionOptions)
}
