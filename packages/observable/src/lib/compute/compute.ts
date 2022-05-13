import { createName } from '../createName'
import { observable } from '../observable'
import { observe } from '../observe'
import {
  ReadonlyEagerSubject,
  ObservedTypesOf,
  ReadonlySubject,
  Named,
} from '../types'

const COMPUTE_GROUP = 'Compute'

export type ComputeOptions = Partial<Named>

export function compute<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
  options?: ComputeOptions,
): ReadonlyEagerSubject<T> {
  const name = createName(COMPUTE_GROUP, options, compute.name)
  const holder = observable(undefined as unknown as T, { name })

  observe(deps, (...values) => {
    holder.set(compute(...values))
  })

  return holder
}
