import { createObservers, createLazy } from '@pavel/utils'
import { createId } from '../createId'
import { Identifiable } from '../types'
import { Getter } from '@pavel/types'

export type ObservableLazyOptions = Partial<Readonly<Identifiable>>

const OBSERVABLE_LAZY_GROUP = 'ObservableLazy'

export function observableLazy<T>(
  compute: Getter<T>,
  options?: ObservableLazyOptions,
) {
  const id = createId(OBSERVABLE_LAZY_GROUP, options)
  const holder = createLazy(compute)
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
