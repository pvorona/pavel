import { Easing, linear } from '@pavel/easing'
import { Transition } from './types'

type Options<T> = {
  duration: number
  easing?: Easing
  initialValue: T
}

export function createTransition({
  duration,
  easing = linear,
  initialValue,
}: Options<number>): Transition<number> {
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
