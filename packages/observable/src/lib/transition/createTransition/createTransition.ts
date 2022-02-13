import { assert } from '@pavel/assert'
import { hasOvershoot } from '@pavel/easing'
import { areSameShapeObjectsShallowEqual } from '@pavel/areSameShapeObjectsShallowEqual'
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

  let timingOptions = createTransitionTimingOptions(options)
  let { duration, easing } = timingOptions

  assert(duration >= 0, `Expected positive duration. Received ${duration}`)

  let startTime = 0.0
  let hasNewValue = false
  let lastObservedValue = initialValue
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

    const currentValue =
      startValue + (targetValue - startValue) * easing(progress)

    if (!hasOvershoot(easing) && currentValue === targetValue) {
      hasNewValue = false
      lastObservedValue = currentValue

      return lastObservedValue
    }

    lastObservedValue = currentValue

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

    if (areSameShapeObjectsShallowEqual(timingOptions, newTimingOptions)) {
      return
    }

    startValue = getCurrentValueAndUpdateHasNewValue()
    startTime = performance.now()
    timingOptions = newTimingOptions
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
