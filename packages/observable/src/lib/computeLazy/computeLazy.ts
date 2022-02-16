import { collectValues } from '../utils'
import { Lambda } from '@pavel/types'
import {
  ReadonlyLazySubject,
  ObservedTypesOf,
  Named,
  ReadonlySubject,
} from '../types'
import { observe } from '../observe'
import { createName } from '../createName'
import { createFunctions } from '@pavel/functions'
import { ObservableTag } from '..'

const COMPUTE_LAZY_GROUP = 'ComputeLazy'

export type ComputeLazyOptions = Partial<Named>

export function computeLazy<A extends ReadonlySubject<unknown>[], T>(
  deps: [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
  options?: ComputeLazyOptions,
): ReadonlyLazySubject<T> {
  const name = createName(COMPUTE_LAZY_GROUP, options, compute.name)
  const observers = createFunctions<Lambda>()
  let value: T
  let dirty = true

  observe(deps, markDirty, { fireImmediately: false, collectValues: false })

  function markDirty() {
    dirty = true
    observers.invoke()
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
    observe: observers.add,
    [ObservableTag]: true,
  }
}
