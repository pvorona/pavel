import { Easing, linear } from '@pavel/easing'
import { PRIORITY, scheduleTask, URGENCY } from '@pavel/scheduling'
import { TransitionV2 } from './types'
import { Lambda } from '../types'
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

export type TransitionOptionsV2 = {
  duration: number
  easing?: Easing
  initialValue: number
  targetValue: number
  onTick: (value: number) => void
}

// 1. Tests
//    - Issue #1: Junky transitions
//      Hypothesis: not updating value to the the latest value before changing target
// 2. Group transitions
// 3. Extract computeIntermediateValue/interpolate
// 4. Understand execution priorities and why future is required
// 5. Extract package

function createNoopTransition(value: number) {
  return {
    stop: () => value,
  }
}

export function createTransitionV2({
  duration,
  easing = linear,
  initialValue,
  targetValue,
  onTick,
}: TransitionOptionsV2): TransitionV2<number> {
  if (duration < 0) {
    throw new Error(`Expected positive duration. Received ${duration}`)
  }

  if (duration === 0) {
    onTick(targetValue)

    return createNoopTransition(targetValue)
  }

  let cancelled = false
  const startTime = performance.now()
  let cancelTask: Lambda | undefined

  if (initialValue !== targetValue) {
    scheduleTick()
  }

  function stop() {
    cancelled = true

    if (cancelTask) {
      cancelTask()
    }

    const [currentValue] = getCurrentValueAndProgress()

    return currentValue
  }

  function tick() {
    if (cancelled) {
      return
    }

    const [currentValue, progress] = getCurrentValueAndProgress()

    onTick(currentValue)

    if (progress !== 1) {
      scheduleTick()
    }
  }

  function scheduleTick() {
    cancelTask = scheduleTask(tick, PRIORITY.COMPUTE)
  }

  function getCurrentValueAndProgress() {
    const progress = getProgress(startTime, duration)
    const currentValue = interpolate(
      initialValue,
      targetValue,
      easing(progress),
    )

    return [currentValue, progress]
  }

  return {
    stop,
  }
}

function getProgress(startTime: number, duration: number): number {
  return Math.min((performance.now() - startTime) / duration, 1)
}

function interpolate(
  initialValue: number,
  targetValue: number,
  easingAdjustedProgress: number,
): number {
  return initialValue + (targetValue - initialValue) * easingAdjustedProgress
}
