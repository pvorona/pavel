import { Lambda, ObservedTypeOf } from '../types'
import {
  createScheduleTaskWithCleanup,
  PRIORITY,
  URGENCY,
} from '@pavel/scheduling'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { AnimatableTarget, InertOptions, InertSubject } from './types'
import { constructTransition } from './constructTransition'

// type State =
//   | { value: AnimatableValue, transition: Transition<AnimatableValue> }
//   | { value: AnimatableCollection, transition: Transition<Record<string,AnimatableValue>>}

export const inert =
  (options: InertOptions) =>
  <T extends AnimatableTarget>(target: T): InertSubject<ObservedTypeOf<T>> => {
    let value = target.get()
    let transition = constructTransition(value, options)
    const observers: Lambda[] = []

    function notify() {
      notifyAll(observers)

      if (!transition.hasCompleted()) {
        scheduleNotifyWithCleanup()
      }
    }

    const scheduleNotifyWithCleanup = createScheduleTaskWithCleanup(
      notify,
      PRIORITY.COMPUTE,
      URGENCY.NEXT_FRAME,
    )

    const get = () => {
      value = transition.getCurrentValue()

      return value
    }

    const setTarget = (newTarget: ObservedTypeOf<T>) => {
      transition.setTargetValue(newTarget as any)

      if (!transition.hasCompleted()) {
        notify()
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
