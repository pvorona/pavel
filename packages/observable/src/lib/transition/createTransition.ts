import { Easing, linear } from '@pavel/easing'
import { Transition } from './types'

export type TransitionOptions = {
  duration: number
  easing?: Easing
  initialValue: number
}

// TODO:
// - [ ] Use class to avoid creating new functions for every transition
export function createTransition({
  duration,
  easing = linear,
  initialValue,
}: TransitionOptions): Transition<number> {
  let startTime = performance.now()
  let startValue = initialValue
  let targetValue = initialValue
  let hasCompleted = true

  const getCurrentValue = () => {
    const progress = Math.min((performance.now() - startTime) / duration, 1)

    if (progress === 1) {
      hasCompleted = true
    }

    return startValue + (targetValue - startValue) * easing(progress)
  }

  const setTargetValue = (newTargetValue: number) => {
    if (newTargetValue === targetValue) {
      return
    }

    startValue = getCurrentValue()
    targetValue = newTargetValue
    hasCompleted = false
    startTime = performance.now()
  }

  return {
    getCurrentValue,
    setTargetValue,
    hasCompleted: () => hasCompleted,
  }
}
