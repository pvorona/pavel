import { Lambda, ObservedTypeOf } from '../types'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { AnimatableTarget, InertOptions, InertSubject } from './types'
import { constructTransition } from './constructTransition'
import { requestIdleCallback, cancelIdleCallback } from './requestIdleCallback'

// type State =
//   | { value: AnimatableValue, transition: Transition<AnimatableValue> }
//   | { value: AnimatableCollection, transition: Transition<Record<string,AnimatableValue>>}

export const inert =
  (options: InertOptions) =>
  <T extends AnimatableTarget>(target: T): InertSubject<ObservedTypeOf<T>> => {
    // Can get lazy. Use case for idleUntilUrgent?
    let value = target.get()
    let transition = constructTransition(value, options)
    let idleCallbackId: undefined | number = undefined

    const observers: Lambda[] = []

    function notifyAndClearIdleCallback() {
      notifyAll(observers)
      idleCallbackId = undefined
    }

    const get = () => {
      // TODO: only compute value once per frame
      value = transition.getCurrentValue()

      if (!transition.hasCompleted() && idleCallbackId === undefined) {
        idleCallbackId = requestIdleCallback(notifyAndClearIdleCallback)
      }

      return value
    }

    const setTarget = (newTarget: ObservedTypeOf<T>) => {
      transition.setTargetValue(newTarget as any)

      if (!transition.hasCompleted() && idleCallbackId === undefined) {
        // notifyAndClearIdleCallback()
        idleCallbackId = requestIdleCallback(notifyAndClearIdleCallback)
      }
    }

    observe([target], setTarget as any, { fireImmediately: false })

    const setTransition = (newOptions: InertOptions) => {
      transition = constructTransition(transition.getCurrentValue(), newOptions)
    }

    return {
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
