import { collectValues } from '../utils'
import {
  ReadonlyLazySubject,
  ObservedTypesOf,
  Named,
  ReadonlySubject,
} from '../types'
import { observe } from '../observe'
import { createName } from '../createName'
import { observableLazy } from '../observable'

const COMPUTE_LAZY_GROUP = 'ComputeLazy'

export type ComputeLazyOptions = Partial<Named>

export function computeLazy<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
  options?: ComputeLazyOptions,
): ReadonlyLazySubject<T> {
  const name = createName(COMPUTE_LAZY_GROUP, options, compute.name)
  const holder = observableLazy(recompute, { name })

  observe(deps, holder.markDirty, {
    fireImmediately: false,
    collectValues: false,
  })

  function recompute() {
    const values = collectValues(deps)

    return compute(...values)
  }

  return holder
}
