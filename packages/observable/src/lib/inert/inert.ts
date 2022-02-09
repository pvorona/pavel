import {
  Lambda,
  ReadonlyEagerSubject,
  ReadonlyLazySubject,
  ObservedTypeOf,
} from '../types'
import {
  createGroupTransition,
  createTransition,
  TransitionOptions,
} from '../transition'
import {
  createScheduleTaskWithCleanup,
  PRIORITY,
  URGENCY,
} from '@pavel/scheduling'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { Easing } from '@pavel/easing'

export type InertOptions =
  | {
      duration: number
      easing?: Easing
    }
  | number

type AnimatableValue = number

type Collection<T> = Record<string, T>

type AnimatableCollection = Collection<AnimatableValue>

type AnimatableTarget =
  | ReadonlyEagerSubject<AnimatableValue>
  | ReadonlyEagerSubject<AnimatableCollection>
  | ReadonlyLazySubject<AnimatableValue>
  | ReadonlyLazySubject<AnimatableCollection>

export type InertSubject<T> = ReadonlyLazySubject<T> & {
  setTransition: (options: InertOptions) => void
}

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

const constructTransition = (
  value: AnimatableValue | AnimatableCollection,
  options: InertOptions,
) => {
  if (typeof value === 'object') {
    const transitions = createTransitions(value, options)

    return createGroupTransition(transitions)
  }

  const transitionOptions = createTransitionOptions(options, value)

  return createTransition(transitionOptions)
}

const createTransitions = (
  collection: Record<string, number>,
  options: InertOptions,
) => {
  const transitions: Record<
    keyof typeof collection,
    ReturnType<typeof createTransition>
  > = {}

  for (const key in collection) {
    transitions[key] = createTransition(
      createTransitionOptions(options, collection[key]),
    )
  }

  return transitions
}

function createTransitionOptions(
  optionsOrDuration: InertOptions,
  initialValue: number,
): TransitionOptions {
  return typeof optionsOrDuration === 'number'
    ? {
        duration: optionsOrDuration,
        initialValue,
      }
    : { ...optionsOrDuration, initialValue }
}
