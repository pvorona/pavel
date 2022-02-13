import { Transition, TransitionTimingOptions } from './types'

// TODO
// - [x] Store hasNewValue state internally to avoid unnecessary
//       computations when calling `getCurrentValue`
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Support { [key: string]: number } as initial value argument
export function createGroupTransition(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  let lastComputedValue = computeCurrentValue()
  let hasNewValue = checkTransitionsHaveNewValue()

  function computeCurrentValue() {
    const newState: { [key: string]: number } = {}

    for (const key in transitions) {
      newState[key] = transitions[key].getCurrentValue()
    }

    return newState
  }

  function getCurrentValue() {
    if (!hasNewValue) {
      return lastComputedValue
    }

    // Order matters here
    lastComputedValue = computeCurrentValue()
    hasNewValue = checkTransitionsHaveNewValue()

    return lastComputedValue
  }

  function setTargetValue(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }

    hasNewValue = checkTransitionsHaveNewValue()
  }

  function checkTransitionsHaveNewValue() {
    for (const key in transitions) {
      if (transitions[key].hasNewValue()) {
        return true
      }
    }

    return false
  }

  function setOptions(options: TransitionTimingOptions) {
    for (const key in transitions) {
      transitions[key].setOptions(options)
    }

    hasNewValue = checkTransitionsHaveNewValue()
  }

  return {
    setTargetValue,
    hasNewValue: () => hasNewValue,
    getCurrentValue,
    setOptions,
  }
}
