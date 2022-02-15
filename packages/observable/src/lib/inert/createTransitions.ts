import { createTransition, Transition } from '../transition'
import { createTransitionOptions } from './createTransitionOptions'
import { InertOptions } from './types'

export const createTransitions = (
  collection: Record<string, number>,
  options: InertOptions,
) => {
  const transitions: Record<string, Transition<number>> = {}

  for (const key in collection) {
    transitions[key] = createTransition(
      createTransitionOptions(options, collection[key]),
    )
  }

  return transitions
}
