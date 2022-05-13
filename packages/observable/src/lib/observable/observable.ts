import { EagerSubject, Gettable, Named, Settable } from '../types'
import { createName } from '../createName'
import { createObservers } from '@pavel/utils'

type InterceptorOptions<T> = {
  intercept?: {
    get?: (target: { set: Settable<T>['set']; get: Gettable<T>['get'] }) => T
    set?: (
      value: T,
      target: { set: Settable<T>['set']; get: Gettable<T>['get'] },
    ) => void
  }
}

export type ObservableOptions<T> = Partial<Named> &
  InterceptorOptions<T> & {
    is?: (a: T, b: T) => boolean
  }

const OBSERVABLE_GROUP = 'Observable'

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions<T>,
): EagerSubject<T> {
  const observers = createObservers<[T]>()
  const name = createName(OBSERVABLE_GROUP, options)

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

  return {
    name,
    get() {
      if (options?.intercept?.get) {
        return options.intercept.get({ get, set })
      }

      return get()
    },
    set(newValue: T) {
      if (options?.intercept?.set) {
        return options.intercept.set(newValue, { get, set })
      }

      if ((options?.is || Object.is)(value, newValue)) {
        return
      }

      set(newValue)
    },
    observe: observers.register,
  }
}
