import { assert, isPositive } from '@pavel/assert'
import { hasOvershoot } from '@pavel/easing'
import { shallowEqual } from '@pavel/utils'
import {
  TransitionOptions,
  TransitionTimingOptions,
  Transition,
} from '../types'
import { createTransitionTimingOptions } from './createTransitionTimingOptions'

// TODO:
// - [ ] Use class to avoid creating new functions for every transition
// - [ ] Get timestamp from requestAnimationFrame
// - [ ] Compute value once per frame
// - [x] Dont compute when completed
// - [ ] Stateless transition

// I don't like it at all
export const createTransition = <T>(
  options: TransitionOptions<T>,
): Transition<T> => {
  let timingOptions = createTransitionTimingOptions(options)

  let startTime = 0.0
  let duration = timingOptions.duration
  let easing = timingOptions.easing

  let startValue = options.initialValue
  let targetValue = options.initialValue
  let lastObservedValue = options.initialValue

  let hasCompleted = true

  assert(
    isPositive(duration),
    `Expected positive duration. Received ${duration}`,
  )

  const getCurrentValueAndUpdateHasCompleted = () => {
    // Smells
    if (hasCompleted) {
      return { value: targetValue, hasCompleted: true }
    }

    const progress = getProgress(startTime, duration, performance.now())

    if (progress === 1) {
      hasCompleted = true
      lastObservedValue = targetValue

      return { value: targetValue, hasCompleted: true }
    }

    const currentValue = computeCurrentValue()

    if (currentValue === targetValue && !hasOvershoot(easing)) {
      hasCompleted = true
      lastObservedValue = targetValue

      return { value: targetValue, hasCompleted: true }
    }

    lastObservedValue = currentValue

    return { value: lastObservedValue, hasCompleted: false }
  }

  function computeCurrentValue() {
    const progress = getProgress(startTime, duration, performance.now())
    const easedProgress = easing(progress)

    return options.interpolate(startValue, targetValue, easedProgress)
  }

  const setTargetValue = (newTargetValue: T) => {
    if (newTargetValue === targetValue) {
      return { hasCompleted }
    }

    // Order matters here
    startValue = computeCurrentValue()
    startTime = performance.now()
    targetValue = newTargetValue
    hasCompleted = lastObservedValue === newTargetValue

    return { hasCompleted }
  }

  const setOptions = (newOptions: TransitionTimingOptions) => {
    const newTimingOptions = createTransitionTimingOptions(newOptions)

    if (shallowEqual(timingOptions, newTimingOptions)) {
      return { hasCompleted }
    }

    startValue = computeCurrentValue()
    startTime = performance.now()
    timingOptions = newTimingOptions
    duration = newTimingOptions.duration
    easing = newTimingOptions.easing
    hasCompleted = lastObservedValue === targetValue

    return { hasCompleted }
  }

  function setInstant(newValue: T) {
    startValue = newValue
    targetValue = newValue
    // Should use better equality check here?
    hasCompleted = newValue === lastObservedValue

    return { hasCompleted }
  }

  return {
    getCurrentValue: getCurrentValueAndUpdateHasCompleted,
    setTargetValue,
    setOptions,
    setInstant,
  }
}

function getProgress(startTime: number, duration: number, currentTime: number) {
  return Math.min((currentTime - startTime) / duration, 1)
}
