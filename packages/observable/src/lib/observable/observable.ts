import { Observer, EagerSubject, Named } from '../types'
import { createName } from '../createName'
import { getValue } from '../utils'
import { Listeners } from '@pavel/utils'

export type ObservableOptions = Partial<Named>

const OBSERVABLE_GROUP = 'Observable'

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions,
): EagerSubject<T> {
  const name = createName(OBSERVABLE_GROUP, options)
  const observers = Listeners<Observer<T>>()
  let value = initialValue

  return {
    name,
    set(newValueOrFactory) {
      const newValue = getValue(newValueOrFactory, value)

      if (newValue === value) {
        return
      }

      value = newValue
      observers.invoke(value)
    },
    get() {
      return value
    },
    observe: observers.add,
  }
}
