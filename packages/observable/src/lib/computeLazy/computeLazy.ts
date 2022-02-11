import {
  collectValues,
  notifyAll,
  removeFirstElementOccurrence,
} from '../utils'
import {
  Lambda,
  ReadonlyLazySubject,
  ObservedTypesOf,
  Named,
  ReadonlySubject,
} from '../types'
import { observe } from '../observe'
import { createName } from '../createName'

const COMPUTE_LAZY_GROUP = 'ComputeLazy'

export type ComputeLazyOptions = Partial<Named>

export function computeLazy<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
  options?: ComputeLazyOptions,
): ReadonlyLazySubject<T> {
  const name = createName(COMPUTE_LAZY_GROUP, options, compute.name)
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
    name,
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
