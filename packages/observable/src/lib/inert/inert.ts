import { Lambda, ObservedTypeOf } from '../types'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { AnimatableSubject, InertOptions, InertSubject } from './types'
import { constructTransition } from './constructTransition'
import { createName, wrapName } from '../createName'
import { PRIORITY, throttleWithFrame } from '@pavel/scheduling'
import { TransitionTimingOptions } from '../transition'

const INERT_GROUP = 'Inert'

export const inert =
  (options: InertOptions) =>
  <T extends AnimatableSubject>(target: T): InertSubject<ObservedTypeOf<T>> => {
    const name = wrapName(createName(INERT_GROUP, options), target.name)
    // Can get lazy. Use case for idleUntilUrgent?
    const transition = constructTransition(target.get(), options)
    const observers: Lambda[] = []

    // TODO: don't emit values when there are no observers.
    // Ensure emitting renews if new observers join while transition is in progress
    const throttledNotifyBeforeNextRender = throttleWithFrame(
      function notifyBeforeNextRender() {
        notifyAll(observers)
      },
      PRIORITY.BEFORE_RENDER,
    )

    const get = () => {
      // TODO: only compute value once per frame
      // TODO: compute value using requestAnimationFrame parameter instead of performance.now()
      // Order matters here:
      // transition.hasNewValue() may change the value
      // after calling transition.getCurrentValue()
      const value = transition.getCurrentValue()

      if (transition.hasNewValue()) {
        throttledNotifyBeforeNextRender()
      }

      return value
    }

    const setTarget = (newTarget: ObservedTypeOf<T>) => {
      transition.setTargetValue(newTarget as any)

      if (transition.hasNewValue()) {
        throttledNotifyBeforeNextRender()
      }
    }

    const setTransition = (newOptions: TransitionTimingOptions) => {
      transition.setOptions(newOptions)

      if (transition.hasNewValue()) {
        throttledNotifyBeforeNextRender()
      }
    }

    observe([target], setTarget, { fireImmediately: false })

    return {
      name,
      setTransition,
      get: get as any,
      observe(observer) {
        observers.push(observer)

        return () => {
          removeFirstElementOccurrence(observers, observer)
        }
      },
    }
  }
