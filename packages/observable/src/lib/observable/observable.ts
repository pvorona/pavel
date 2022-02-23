import { EagerSubject, Named } from '../types'
import { createName } from '../createName'
import { createObservers } from '@pavel/utils'
import { createProxy } from './createProxy'

export type ObservableOptions = Partial<Named>

const OBSERVABLE_GROUP = 'Observable'

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions,
): EagerSubject<T> {
  const observers = createObservers<[T]>()
  const name = createName(OBSERVABLE_GROUP, options)

  let rawValue = initialValue
  let reactiveValue = createProxy(rawValue, notify)

  function notify() {
    observers.notify(reactiveValue)
  }

  return {
    name,
    get value() {
      return reactiveValue
    },
    set value(newValue: T) {
      if (Object.is(rawValue, newValue)) {
        return
      }

      rawValue = newValue
      reactiveValue = createProxy(rawValue, notify)

      notify()
    },
    observe: observers.register,
  }
}
