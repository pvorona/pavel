import { createObservers, lazyValue } from '@pavel/utils'
import { createId } from '../createId'
import { Identifiable } from '../types'

export type ObservableLazyOptions = Partial<Identifiable>

const OBSERVABLE_LAZY_GROUP = 'ObservableLazy'

export function observableLazy<T>(
  compute: () => T,
  options?: ObservableLazyOptions,
) {
  const id = createId(OBSERVABLE_LAZY_GROUP, options)
  const holder = lazyValue(compute)
  const observers = createObservers()

  function notifyChanged() {
    holder.notifyChanged()
    observers.notify()
  }

  return {
    id,
    notifyChanged,
    observe: observers.register,
    get: holder.get,
  }
}
