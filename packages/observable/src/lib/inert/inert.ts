import {
  Lambda,
  ObservedTypeOf,
  ReadonlyEagerSubject,
  ReadonlyLazySubject,
} from '../types'
import { createScheduleTaskWithCleanup, PRIORITY } from '@pavel/scheduling'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import {
  AnimatableTarget,
  AnimatableValue,
  InertOptions,
  InertSubject,
} from './types'
import { constructTransition } from './constructTransition'
import { observable } from '../observable'
import { createTransitionV2, TransitionV2 } from '../transition'

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

// can get lazily
export const inertV2 =
  (options: InertOptions) =>
  (
    target:
      | ReadonlyEagerSubject<AnimatableValue>
      | ReadonlyLazySubject<AnimatableValue>,
  ): InertSubject<number> => {
    const currentValue = observable(target.get())
    let transition: undefined | TransitionV2<number>
    let innerOptions = options

    const onTargetValueChange = (newTarget: number) => {
      if (transition) {
        currentValue.set(transition.stop())
      }

      transition = createTransitionV2({
        initialValue: currentValue.get(),
        targetValue: newTarget,
        onTick: currentValue.set,
        ...liftTransitionOptionsV2(innerOptions),
      })
    }

    if (typeof options !== 'number' && options?.name === 'inertVisibleMax') {
      currentValue.observe(value => console.log(`inertVisibleMax: ${value}`))
    }

    const setTransition = (newOptions: InertOptions) => {
      if (transition) {
        currentValue.set(transition.stop())
      }
      innerOptions = newOptions
    }

    observe([target], onTargetValueChange, { fireImmediately: false })

    return {
      get: currentValue.get,
      observe: currentValue.observe,
      setTransition,
    }
  }

function liftTransitionOptionsV2(options: InertOptions) {
  if (typeof options === 'number') {
    return {
      duration: options,
    }
  }

  return options
}
