import { ObservedTypeOf, ValueOrUpdater } from '../types'
import { observe } from '../observe'
import { AnimatableSubject, InertOptions, InertSubject } from './types'
import { constructTransition } from './constructTransition'
import { createName, wrapName } from '../createName'
import { PRIORITY, throttleWithFrame } from '@pavel/scheduling'
import { Lambda } from '@pavel/types'
import { TransitionTimingOptions } from '../transition'
import { createFunctions } from '@pavel/functions'
import { getValue } from '../utils'

const INERT_GROUP = 'Inert'

export const inert =
  (options: InertOptions) =>
  <T extends AnimatableSubject>(target: T): InertSubject<ObservedTypeOf<T>> => {
    const name = wrapName(createName(INERT_GROUP, options), target.name)
    // Can get lazy. Use case for idleUntilUrgent?
    const transition = constructTransition(target.get(), options)
    const observers = createFunctions<Lambda>()

    // TODO: don't emit values when there are no observers.
    // Ensure emitting renews if new observers join while transition is in progress
    const throttledNotifyBeforeNextRender = throttleWithFrame(
      observers.invoke,
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

    function set(valueOrUpdater: ValueOrUpdater<ObservedTypeOf<T>>) {
      const value = getValue(
        valueOrUpdater,
        transition.getCurrentValue().value as never,
      )
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
      name,
      setTransition,
      get: get as never,
      set,
      complete,
      observe: observers.add,
    }
  }
