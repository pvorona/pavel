import { Transition, TransitionTimingOptions } from './types'

// TODO
// - [x] Store hasCompleted state internally to avoid unnecessary
//       computations when calling `getCurrentValue`
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Support { [key: string]: number } as initial value argument
export function createGroupTransition(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  let currentValue = computeCurrentValue()
  let hasEmittedLastValue = areTransitionsEmittedLastValue()

  function computeCurrentValue() {
    const newState: { [key: string]: number } = {}

    for (const key in transitions) {
      newState[key] = transitions[key].getCurrentValue()
    }

    return newState
  }

  function getCurrentValue() {
    if (hasEmittedLastValue) {
      return currentValue
    }

    currentValue = computeCurrentValue()
    hasEmittedLastValue = areTransitionsEmittedLastValue()

    return currentValue
  }

  function setTargetValue(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }

    hasEmittedLastValue = areTransitionsEmittedLastValue()
  }

  function areTransitionsEmittedLastValue() {
    for (const key in transitions) {
      if (!transitions[key].hasPendingObservation()) {
        return false
      }
    }

    return true
  }

  function setOptions(options: TransitionTimingOptions) {
    for (const key in transitions) {
      transitions[key].setOptions(options)
    }

    hasEmittedLastValue = areTransitionsEmittedLastValue()
  }

  return {
    setTargetValue,
    hasPendingObservation: () => hasEmittedLastValue,
    getCurrentValue,
    setOptions,
  }
}
