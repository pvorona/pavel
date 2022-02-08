import {
  Lambda,
  LazyObservable,
  Gettable,
  ObservedTypeOf,
  EagerObservable,
} from '../types'
import { createGroupTransition, createTransition } from '../transition'
import {
  createScheduleTaskWithCleanup,
  PRIORITY,
  URGENCY,
} from '@pavel/scheduling'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { Easing } from '@pavel/easing'

type Options = {
  duration: number
  easing?: Easing
}

type AnimatableValue = number

type Collection<T> = Record<string, T>

type AnimatableCollection = Collection<AnimatableValue>

type AnimatableTarget =
  | (EagerObservable<AnimatableValue> & Gettable<AnimatableValue>)
  | (EagerObservable<AnimatableCollection> & Gettable<AnimatableCollection>)
  | (LazyObservable & Gettable<AnimatableValue>)
  | (LazyObservable & Gettable<AnimatableCollection>)

// type State = { value: number }
type InertSubject<T> = LazyObservable &
  Gettable<T> & {
    setTransition: (options: Options) => void
  }

export const inert =
  (options: Options) =>
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

    const setTransition = (newOptions: Options) => {
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

const constructTransition = (
  value: AnimatableValue | AnimatableCollection,
  options: Options,
) => {
  if (typeof value === 'object') {
    const transitions = createTransitions(value, options)

    return createGroupTransition(transitions)
  }

  return createTransition({ ...options, initialValue: value })
}

const createTransitions = (
  collection: Record<string, number>,
  options: Options,
) => {
  const transitions: Record<
    keyof typeof collection,
    ReturnType<typeof createTransition>
  > = {}

  for (const key in collection) {
    transitions[key] = createTransition({
      ...options,
      initialValue: collection[key],
    })
  }

  return transitions
}
