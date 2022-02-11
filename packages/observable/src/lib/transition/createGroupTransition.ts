import { shallowEqual } from '../utils'
import { Transition } from './types'

// TODO:
// - [ ] Store hasCompleted state internally to avoid unnecessary
//       computations when calling `getCurrentValue`
// - [ ] Use class to avoid creating new functions for every transition
export function createGroupTransition(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  let state = computeState()

  function computeState() {
    const newState: { [key: string]: number } = {}

    for (const key in transitions) {
      newState[key] = transitions[key].getCurrentValue()
    }

    return newState
  }

  function getCurrentValue() {
    const newState = computeState()

    if (shallowEqual(state, newState)) {
      // Preserve referential transparency for selectors
      return state
    }

    state = newState

    return state
  }

  function setTargetValue(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }
  }

  function hasCompleted() {
    for (const key in transitions) {
      if (!transitions[key].hasCompleted()) {
        return false
      }
    }

    return true
  }

  return {
    setTargetValue,
    hasCompleted,
    getCurrentValue,
  }
}

// TODO
// - [ ] Support { [key: string]: number } as initial value argument
export function createGroupTransitionV3(transitions: {
  [key: string]: Transition<number>
}): Transition<{ [key: string]: number }> {
  let currentValue = computeCurrentValue()
  let hasCompleted = areTransitionsCompleted()

  function computeCurrentValue() {
    const newState: { [key: string]: number } = {}

    for (const key in transitions) {
      newState[key] = transitions[key].getCurrentValue()
    }

    return newState
  }

  function getCurrentValue() {
    if (hasCompleted) {
      return currentValue
    }

    currentValue = computeCurrentValue()
    hasCompleted = areTransitionsCompleted()

    return currentValue
  }

  function setTargetValue(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }

    hasCompleted = areTransitionsCompleted()
  }

  function areTransitionsCompleted() {
    for (const key in transitions) {
      if (!transitions[key].hasCompleted()) {
        return false
      }
    }

    return true
  }

  return {
    setTargetValue,
    hasCompleted: () => hasCompleted,
    getCurrentValue,
  }
}
