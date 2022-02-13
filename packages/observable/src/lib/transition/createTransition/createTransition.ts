import { hasOvershoot } from '@pavel/easing'
import {
  TransitionTimingOptionsObject,
  TransitionTimingOptions,
  Transition,
} from '../types'
import { createTransitionTimingOptions } from './createTransitionTimingOptions'

export type TransitionOptions = TransitionTimingOptionsObject & {
  initialValue: number
}

// TODO:
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Get timestamp from requestAnimationFrame
// - [ ] Compute value once per frame
// - [x] Dont compute when completed
// - [ ] Stateless transition

export const createTransition = (
  options: TransitionOptions,
): Transition<number> => {
  const { initialValue } = options

  let { duration, easing } = createTransitionTimingOptions(options)

  if (duration < 0) {
    throw new Error(`Expected positive duration. Received ${duration}`)
  }

  let hasNewValue = false
  let lastObservedValue = initialValue
  let startTime = 0.0
  let startValue = initialValue
  let targetValue = initialValue

  const getCurrentValueAndUpdateHasNewValue = () => {
    if (!hasNewValue) {
      return lastObservedValue
    }

    const progress = Math.min((performance.now() - startTime) / duration, 1)

    if (progress === 1) {
      hasNewValue = false
      lastObservedValue = targetValue

      return lastObservedValue
    }

    lastObservedValue =
      startValue + (targetValue - startValue) * easing(progress)

    if (!hasOvershoot(easing) && lastObservedValue === targetValue) {
      hasNewValue = false
      lastObservedValue = targetValue

      return lastObservedValue
    }

    return lastObservedValue
  }

  const setTargetValue = (newTargetValue: number) => {
    if (newTargetValue === targetValue) {
      return
    }

    // Order matters here
    const previousLastObservedValue = lastObservedValue
    startValue = getCurrentValueAndUpdateHasNewValue()
    targetValue = newTargetValue
    hasNewValue = previousLastObservedValue !== newTargetValue
    startTime = performance.now()
  }

  const setOptions = (newOptions: TransitionTimingOptions) => {
    const newTimingOptions = createTransitionTimingOptions(newOptions)

    // if (newOptions.duration === duration && getEasing(newOptions) === easing) {
    //   return
    // }

    startValue = getCurrentValueAndUpdateHasNewValue()
    startTime = performance.now()
    duration = newTimingOptions.duration
    easing = newTimingOptions.easing
  }

  return {
    hasNewValue: () => hasNewValue,
    getCurrentValue: getCurrentValueAndUpdateHasNewValue,
    setTargetValue,
    setOptions,
  }
}
