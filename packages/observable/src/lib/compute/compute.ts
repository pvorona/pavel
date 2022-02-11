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
  const obs = observable(undefined as unknown as T)

  observe(deps, (...values) => {
    obs.set(compute(...values))
  })

  return {
    name,
    get: obs.get,
    observe: obs.observe,
  }
}
