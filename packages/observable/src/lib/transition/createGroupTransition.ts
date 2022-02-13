import { TransitionV4, TransitionTimingOptions } from './types'

// TODO
// - [x] Store hasNewValue state internally to avoid unnecessary
//       computations when calling `getCurrentValue`
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Support { [key: string]: number } as initial value argument
export function createGroupTransition(transitions: {
  [key: string]: TransitionV4<number>
}): TransitionV4<{ [key: string]: number }> {
  function getCurrentValue() {
    const newValue: { [key: string]: number } = {}
    let hasCompleted = true

    for (const key in transitions) {
      const { value, hasCompleted: localHasCompleted } =
        transitions[key].getCurrentValue()
      newValue[key] = value
      hasCompleted &&= localHasCompleted
    }

    return { value: newValue, hasCompleted }
  }

  function setTargetValue(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }

    return getCurrentValue()
  }

  function setOptions(options: TransitionTimingOptions) {
    for (const key in transitions) {
      transitions[key].setOptions(options)
    }

    return getCurrentValue()
  }

  return {
    setTargetValue,
    getCurrentValue,
    setOptions,
  }
}
