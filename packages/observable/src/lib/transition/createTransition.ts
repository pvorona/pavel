import { Easing, linear } from '@pavel/easing'
import { Transition } from './types'

export type TransitionOptions = {
  duration: number
  easing?: Easing
  initialValue: number
}

// TODO:
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Get timestamp from requestAnimationFrame
// - [ ] Compute value once per frame
// - [x] Dont compute when completed

export const createTransition = ({
  initialValue,
  duration,
  easing = linear,
}: TransitionOptions): Transition<number> => {
  if (duration < 0) {
    throw new Error(`Expected positive duration. Received ${duration}`)
  }

  let hasCompleted = true
  let startTime = 0.0
  let startValue = initialValue
  let targetValue = initialValue

  const getCurrentValue = () => {
    if (hasCompleted) {
      return targetValue
    }

    const progress = Math.min((performance.now() - startTime) / duration, 1)

    if (progress === 1) {
      hasCompleted = true

      return targetValue
    }

    return startValue + (targetValue - startValue) * easing(progress)
  }

  const setTargetValue = (newTargetValue: number) => {
    if (newTargetValue === targetValue) {
      return
    }

    // Order matters here
    startValue = getCurrentValue()
    hasCompleted = false
    targetValue = newTargetValue
    startTime = performance.now()
  }

  return { hasCompleted: () => hasCompleted, getCurrentValue, setTargetValue }
}
