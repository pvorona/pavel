import {
  collectValues,
  notifyAll,
  removeFirstElementOccurrence,
} from '../utils'
import { Lambda, ReadonlyLazySubject, ObservedTypesOf } from '../types'
import { observe } from '../observe'
import { ReadonlySubject } from '..'

export function computeLazy<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
): ReadonlyLazySubject<T> {
  const observers: Lambda[] = []
  let value: T
  let dirty = true

  observe(deps, markDirty, { fireImmediately: false, collectValues: false })

  function markDirty() {
    dirty = true
    notifyAll(observers)
  }

  function recompute() {
    const values = collectValues(deps)

    return compute(...values)
  }

  return {
    get() {
      if (dirty) {
        value = recompute()
        dirty = false
      }
      return value
    },
    observe(observer: Lambda) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}
