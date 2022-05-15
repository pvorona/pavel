import { ObservedTypeOf } from '../types'
import { observe } from '../observe'
import {
  AnyAnimatableSubject,
  InertOptions,
  InertSubject,
  TargetDescriptor,
  TargetOrTargetDescriptor,
} from './types'
import { constructTransition } from './constructTransition'
import { createId, createWrapperId } from '../createId'
import { PRIORITY, throttleTask } from '@pavel/scheduling'
import { TransitionTimingOptions } from '../transition'
import { createObservers } from '@pavel/utils'

const INERT_GROUP = 'Inert'

export const interpolateNumber = (
  startValue: number,
  endValue: number,
  progress: number,
) => startValue + (endValue - startValue) * progress

export function interpolateMap<T extends Record<string, number>>(
  start: T,
  end: T,
  progress: number,
): T {
  const result = {} as T

  for (const key in start) {
    result[key] = interpolateNumber(start[key], end[key], progress) as any
  }

  return result
}

export function interpolateMinMax<
  T extends Record<string, { min: number; max: number }>,
>(start: T, end: T, progress: number): T {
  const result = {} as T

  for (const key in start) {
    result[key] = {
      min: interpolateNumber(start[key].min, end[key].min, progress),
      max: interpolateNumber(start[key].max, end[key].max, progress),
    } as any
  }

  return result
}

function getTargetDescriptor<T extends AnyAnimatableSubject>(
  targetOrTargetDescriptor: TargetOrTargetDescriptor<T>,
): TargetDescriptor<T> {
  if ('target' in targetOrTargetDescriptor) {
    return targetOrTargetDescriptor as TargetDescriptor<T>
  }

  return {
    target: targetOrTargetDescriptor,
    interpolate: interpolateNumber,
  } as unknown as TargetDescriptor<T>
}

export const inert =
  (options: InertOptions) =>
  <T extends AnyAnimatableSubject>(
    targetOrTargetDescriptor: TargetOrTargetDescriptor<T>,
  ): InertSubject<ObservedTypeOf<T>> => {
    const { target, interpolate } = getTargetDescriptor(
      targetOrTargetDescriptor,
    )
    // Can get lazy. Use case for idleValue?
    const transition = constructTransition(
      target.get(),
      options,
      interpolate as any,
    )
    const observers = createObservers()
    const name = createWrapperId(createId(INERT_GROUP, options), target.id)

    // TODO: don't emit values when there are no observers.
    // Ensure emitting renews if new observers join while transition is in progress
    const throttledNotifyBeforeNextRender = throttleTask(
      observers.notify,
      PRIORITY.BEFORE_RENDER,
    )

    const get = () => {
      // TODO: only compute value once per frame
      // TODO: compute value using requestAnimationFrame parameter instead of performance.now()
      const { value, hasCompleted } = transition.getCurrentValue()

      if (!hasCompleted) {
        throttledNotifyBeforeNextRender()
      }

      return value
    }

    const setTarget = (newTarget: ObservedTypeOf<T>) => {
      const { hasCompleted } = transition.setTargetValue(newTarget as never)

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
      const { hasCompleted } = transition.setInstant(value as never)

      if (!hasCompleted) {
        throttledNotifyBeforeNextRender()
      }
    }

    function complete() {
      set(target.get() as never)
    }

    observe([target], setTarget, { fireImmediately: false })

    return {
      id: name,
      setTransition,
      get,
      // Remove setter and use complete?
      set,
      complete,
      observe: observers.register,
    }
  }
