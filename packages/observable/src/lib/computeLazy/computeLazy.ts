import { collectValues } from '../utils'
import {
  ReadonlyLazySubject,
  ObservedTypesOf,
  Identifiable,
  ReadonlySubject,
} from '../types'
import { observe } from '../observe'
import { createId } from '../createId'
import { observableLazy } from '../observable'

const COMPUTE_LAZY_GROUP = 'ComputeLazy'

export type ComputeLazyOptions = Partial<Readonly<Identifiable>>

export function computeLazy<Deps extends ReadonlySubject<unknown>[], Output>(
  deps: readonly [...Deps],
  compute: (...args: ObservedTypesOf<Deps>) => Output,
  options?: ComputeLazyOptions,
): ReadonlyLazySubject<Output> {
  const id = createId(COMPUTE_LAZY_GROUP, options, compute.name)
  const holder = observableLazy(recompute, { id })

  observe(deps, holder.notifyChanged, {
    fireImmediately: false,
    collectValues: false,
  })

  function recompute() {
    const values = collectValues(deps)
    return compute(...values)
  }

  return holder
}
