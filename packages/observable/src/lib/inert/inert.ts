import { observe } from '../observe'
import {
  AnimatableSubject,
  AnimatableValue,
  InertOptions,
  InertSubject,
} from './types'
import { constructTransition } from './constructTransition'
import { createId, createWrapperId } from '../createId'
import {
  getCurrentFrameTimestamp,
  PRIORITY,
  throttleTask,
} from '@pavel/scheduling'
import { Interpolate, TransitionTimingOptions } from '../transition'
import { createObservers } from '@pavel/utils'
import { RecordKey } from '@pavel/types'
import { ObservedTypeOf } from '../types'
import { isNumber, isObject, isUndefined } from '@pavel/assert'

const INERT_GROUP = 'Inert'

export const interpolateNumber = (
  startValue: number,
  endValue: number,
  progress: number,
) => startValue + (endValue - startValue) * progress

export function interpolateMap<T extends Record<RecordKey, number | T>>(
  start: T,
  end: T,
  progress: number,
): T {
  const result = {} as T

  for (const key in start) {
    const startValue = start[key]

    if (isObject(startValue)) {
      result[key] = interpolateMap(
        startValue as T,
        end[key] as T,
        progress,
      ) as T[typeof key]
    } else {
      result[key] = interpolateNumber(
        startValue,
        end[key] as number,
        progress,
      ) as T[typeof key]
    }
  }

  return result
}

export const inert = <T extends AnimatableSubject<AnimatableValue>>(
  options: InertOptions<T>,
): InertSubject<ObservedTypeOf<T>> => {
  const { target } = options
  const initialValue = target.get() as ObservedTypeOf<T>
  const interpolate = (() => {
    if (isNumber(initialValue)) {
      return interpolateNumber
    }

    return interpolateMap
  })() as Interpolate<ObservedTypeOf<T>>

  const transition = constructTransition(initialValue, options, interpolate)
  const observers = createObservers()
  const id = createWrapperId(createId(INERT_GROUP, options), target.id)

  let lastFrameTimestamp: DOMHighResTimeStamp | undefined = undefined
  let lastValue: ObservedTypeOf<T> | undefined = undefined

  // TODO: don't emit values when there are no observers.
  // Ensure emitting renews if new observers join while transition is in progress
  const throttledNotifyBeforeNextRender = throttleTask(
    observers.notify,
    PRIORITY.BEFORE_RENDER,
  )

  const get = () => {
    const currentFrameTimestamp = getCurrentFrameTimestamp()

    if (
      !isUndefined(currentFrameTimestamp) &&
      currentFrameTimestamp === lastFrameTimestamp
    ) {
      return lastValue as ObservedTypeOf<T>
    }

    lastFrameTimestamp = currentFrameTimestamp

    // TODO: compute value using requestAnimationFrame parameter instead of performance.now()
    const { value, hasCompleted } = transition.getCurrentValue()

    lastValue = value

    if (!hasCompleted) {
      throttledNotifyBeforeNextRender()
    }

    return value
  }

  const setTarget = (newTarget: ObservedTypeOf<T>) => {
    const { hasCompleted } = transition.setTargetValue(newTarget)

    if (!hasCompleted) {
      throttledNotifyBeforeNextRender()
    }
  }

  const setTransition = (newOptions: TransitionTimingOptions) => {
    const { hasCompleted } = transition.setOptions(newOptions)

    if (!hasCompleted) {
      throttledNotifyBeforeNextRender()
    }
  }

  function set(value: ObservedTypeOf<T>) {
    const { hasCompleted } = transition.setInstant(value)

    if (!hasCompleted) {
      throttledNotifyBeforeNextRender()
    }
  }

  function complete() {
    set(target.get() as ObservedTypeOf<T>)
  }

  observe([target], setTarget, { fireImmediately: false })

  return {
    id,
    setTransition,
    get,
    set,
    complete,
    observe: observers.register,
  }
}
