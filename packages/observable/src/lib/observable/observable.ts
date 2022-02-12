import { removeFirstElementOccurrence, notifyAllWithValue } from '../utils'
import { Observer, EagerSubject, Named } from '../types'
import { createName } from '../createName'

export type ObservableOptions = Partial<Named>

const OBSERVABLE_GROUP = 'Observable'

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions,
): EagerSubject<T> {
  const name = createName(OBSERVABLE_GROUP, options)
  let value = initialValue
  const observers: Observer<T>[] = []

  function notify() {
    notifyAllWithValue(observers, value)
  }

  return {
    name,
    set(newValueOrFactory) {
      const newValue =
        newValueOrFactory instanceof Function
          ? newValueOrFactory(value)
          : newValueOrFactory

      if (newValue === value) {
        return
      }

      value = newValue

      notify()
    },
    get() {
      return value
    },
    // fire immediately can solve Gettable dependency
    observe(observer) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}
