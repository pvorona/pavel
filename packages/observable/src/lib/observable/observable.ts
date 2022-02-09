import { removeFirstElementOccurrence, notifyAllWithValue } from '../utils'
import { Observer, EagerSubject } from '../types'

export function observable<T>(
  initialValue: T,
): EagerSubject<T> {
  let value = initialValue
  const observers: Observer<T>[] = []

  function notify() {
    notifyAllWithValue(observers, value)
  }

  return {
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
