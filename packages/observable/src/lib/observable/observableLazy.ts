import { createObservers, lazyValue } from '@pavel/utils'
import { createName } from '../createName'
import { Named } from '../types'

export type ObservableLazyOptions = Partial<Named>

const OBSERVABLE_LAZY_GROUP = 'ObservableLazy'

export function observableLazy<T>(
  compute: () => T,
  options?: ObservableLazyOptions,
) {
  const name = createName(OBSERVABLE_LAZY_GROUP, options)
  const holder = lazyValue(compute)
  const observers = createObservers()

  function notifyChanged() {
    holder.notifyChanged()
    observers.notify()
  }

  return {
    name,
    notifyChanged,
    observe: observers.register,
    get value() {
      return holder.get()
    },
  }
}
