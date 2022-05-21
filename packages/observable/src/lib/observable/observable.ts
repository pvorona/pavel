import { EagerSubject, Gettable, Identifiable, Settable } from '../types'
import { createId } from '../createId'
import { createObservers } from '@pavel/utils'

type InterceptorOptions<T> = {
  readonly get?: (target: {
    set: Settable<T>['set']
    get: Gettable<T>['get']
  }) => T
  readonly set?: (
    value: T,
    target: { set: Settable<T>['set']; get: Gettable<T>['get'] },
  ) => void
}

export type ObservableOptions<T> = Partial<Identifiable> &
  InterceptorOptions<T> & {
    readonly is?: (a: T, b: T) => boolean
  }

const OBSERVABLE_GROUP = 'Observable'

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions<T>,
): EagerSubject<T> {
  const is = options?.is ?? Object.is
  const observers = createObservers<[T]>()
  const id = createId(OBSERVABLE_GROUP, options)

  let value = initialValue

  function get() {
    return value
  }

  function set(newValue: T) {
    value = newValue

    notify()
  }

  function notify() {
    observers.notify(value)
  }

  function defaultSet(newValue: T) {
    if (is(value, newValue)) {
      return
    }

    set(newValue)
  }

  const publicGet = (() => {
    if (options?.get) {
      const interceptGet = options.get

      return () => interceptGet({ get, set })
    }

    return get
  })()

  const publicSet = (() => {
    if (options?.set) {
      const interceptSet = options.set

      return (newValue: T) => interceptSet(newValue, { get, set })
    }

    return defaultSet
  })()

  return {
    id,
    get: publicGet,
    set: publicSet,
    observe: observers.register,
  }
}
