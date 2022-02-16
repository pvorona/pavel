import { createName } from '../createName'
import { observable } from '../observable'
import { observe } from '../observe'
import {
  ReadonlyEagerSubject,
  ObservedTypesOf,
  ReadonlySubject,
  Named,
  ObservableTag,
} from '../types'

const COMPUTE_GROUP = 'Compute'

export type ComputeOptions = Partial<Named>

export function compute<D extends ReadonlySubject<unknown>[], T>(
  dependencies: D,
  compute: (...args: ObservedTypesOf<D>) => T,
  options?: ComputeOptions,
): ReadonlyEagerSubject<T> {
  const name = createName(COMPUTE_GROUP, options, compute.name)
  const obs = observable(undefined as unknown as T)

  observe(dependencies, (...values) => {
    obs.set(compute(...values))
  })

  return {
    name,
    get: obs.get,
    observe: obs.observe,
    [ObservableTag]: true,
  }
}
