import { shallowEqual } from '../utils'
import { Transition } from './types'

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

  function getState() {
    const newState = computeState()
    if (shallowEqual(state, newState)) {
      // Preserve referential transparency for selectors
      return state
    }
    state = newState
    return state
  }

  function setTarget(target: { [key: string]: number }) {
    for (const key in target) {
      transitions[key].setTargetValue(target[key])
    }
  }

  function isFinished() {
    for (const key in transitions) {
      if (!transitions[key].hasCompleted()) return false
    }
    return true
  }

  return {
    setTargetValue: setTarget,
    hasCompleted: isFinished,
    getCurrentValue: getState,
  }
}
