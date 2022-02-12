import { Easing, linear } from '@pavel/easing'
import {
  TransitionTimingOptionsObject,
  TransitionTimingOptions,
  Transition,
  TransitionTiming,
} from '../types'

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
    targetValue = newTargetValue
    hasCompleted = startValue === newTargetValue
    startTime = performance.now()
  }

  const setOptions = (newOptions: TransitionTimingOptions) => {
    const newTimingOptions = createTransitionTimingOptions(newOptions)

    // if (newOptions.duration === duration && getEasing(newOptions) === easing) {
    //   return
    // }

    startValue = getCurrentValue()
    startTime = performance.now()
    duration = newTimingOptions.duration
    easing = newTimingOptions.easing
  }

  return {
    hasCompleted: () => hasCompleted,
    getCurrentValue,
    setTargetValue,
    setOptions,
  }
}

const DEFAULT_EASING = linear

function getEasing(options: TransitionTimingOptionsObject): Easing {
  if (options.easing) {
    return options.easing
  }

  return DEFAULT_EASING
}

export function createTransitionTimingOptions(
  optionsOrDuration: TransitionTimingOptions,
): TransitionTiming {
  if (typeof optionsOrDuration === 'number') {
    return {
      duration: optionsOrDuration,
      easing: DEFAULT_EASING,
    }
  }

  const easing = getEasing(optionsOrDuration)

  return { ...optionsOrDuration, easing }
}
