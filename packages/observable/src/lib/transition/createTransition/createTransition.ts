import { assert } from '@pavel/assert'
import { hasOvershoot } from '@pavel/easing'
import { areSameShapeObjectsShallowEqual } from '@pavel/utils'
import {
  TransitionTimingOptionsObject,
  TransitionTimingOptions,
  TransitionV4,
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
): TransitionV4<number> => {
  const { initialValue } = options

  let timingOptions = createTransitionTimingOptions(options)
  let { duration, easing } = timingOptions

  assert(duration >= 0, `Expected positive duration. Received ${duration}`)

  let startTime = 0.0
  let lastObservedValue = initialValue
  let startValue = initialValue
  let targetValue = initialValue
  let hasCompleted = true

  const getCurrentValueAndUpdateHasCompleted = () => {
    if (hasCompleted) {
      return { value: targetValue, hasCompleted }
    }

    const progress = Math.min((performance.now() - startTime) / duration, 1)

    if (progress === 1) {
      hasCompleted = true
      lastObservedValue = targetValue

      return { value: lastObservedValue, hasCompleted }
    }

    const currentValue =
      startValue + (targetValue - startValue) * easing(progress)

    if (!hasOvershoot(easing) && currentValue === targetValue) {
      hasCompleted = true
      return { value: currentValue, hasCompleted: true }
    }

    lastObservedValue = currentValue

    return { value: lastObservedValue, hasCompleted }
  }

  // function computeCurrentValue () {
  //   const progress = Math.min((performance.now() - startTime) / duration, 1)

  //   return startValue + (targetValue - startValue) * easing(progress)
  // }

  const setTargetValue = (newTargetValue: number) => {
    if (newTargetValue === targetValue) {
      return { hasCompleted }
    }

    // Order matters here
    const previousLastObservedValue = lastObservedValue
    const { value } = getCurrentValueAndUpdateHasCompleted()
    startValue = value
    targetValue = newTargetValue
    hasCompleted = previousLastObservedValue === newTargetValue
    startTime = performance.now()

    return { hasCompleted }
  }

  const setOptions = (newOptions: TransitionTimingOptions) => {
    const newTimingOptions = createTransitionTimingOptions(newOptions)

    if (areSameShapeObjectsShallowEqual(timingOptions, newTimingOptions)) {
      return { hasCompleted }
    }

    const { value } = getCurrentValueAndUpdateHasCompleted()
    startValue = value
    startTime = performance.now()
    timingOptions = newTimingOptions
    duration = newTimingOptions.duration
    easing = newTimingOptions.easing

    return { hasCompleted: lastObservedValue === targetValue }
  }

  return {
    getCurrentValue: getCurrentValueAndUpdateHasCompleted,
    setTargetValue,
    setOptions,
  }
}
