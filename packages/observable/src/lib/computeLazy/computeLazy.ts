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
import { lazyValue } from '@pavel/utils'

const COMPUTE_LAZY_GROUP = 'ComputeLazy'

export type ComputeLazyOptions = Partial<Named>

export function computeLazy<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
  options?: ComputeLazyOptions,
): ReadonlyLazySubject<T> {
  const name = createName(COMPUTE_LAZY_GROUP, options, compute.name)
  const holder = lazyValue(recompute)
  const observers = createFunctions<Lambda>()

  observe(deps, markDirty, { fireImmediately: false, collectValues: false })

  function markDirty() {
    holder.notifyChanged()
    observers.invoke()
  }

  function recompute() {
    const values = collectValues(deps)

    return compute(...values)
  }

  return {
    name,
    get: holder.get,
    observe: observers.add,
  }
}
