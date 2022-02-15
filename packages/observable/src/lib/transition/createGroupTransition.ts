import { Transition, TransitionTimingOptions } from './types'

// TODO
// - [ ] Store hasCompleted state internally to avoid unnecessary
//       computations when calling `getCurrentValue`
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Support { [key: string]: number } as initial value argument
export function createGroupTransition(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  function setTargetValue(target: { [key: string]: number }) {
    let hasCompleted = true

    for (const key in target) {
      const { hasCompleted: localHasCompleted } = transitions[
        key
      ].setTargetValue(target[key])
      hasCompleted &&= localHasCompleted
    }

    return { hasCompleted }
  }

  function setOptions(options: TransitionTimingOptions) {
    let hasCompleted = true

    for (const key in transitions) {
      const { hasCompleted: localHasCompleted } =
        transitions[key].setOptions(options)
      hasCompleted &&= localHasCompleted
    }

    return { hasCompleted }
  }

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

  return {
    setTargetValue,
    getCurrentValue,
    setOptions,
  }
}
