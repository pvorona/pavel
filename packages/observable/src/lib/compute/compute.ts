import { observable } from '../observable'
import { observe } from '../observe'
import {
  ReadonlyEagerSubject,
  ObservedTypesOf,
  ReadonlySubject,
} from '../types'

export function compute<A extends ReadonlySubject<unknown>[], T>(
  deps: readonly [...A],
  compute: (...args: ObservedTypesOf<A>) => T,
): ReadonlyEagerSubject<T> {
  const obs = observable(undefined as unknown as T)

  observe(deps, (...values) => {
    obs.set(compute(...values))
  })

  return {
    get: obs.get,
    observe: obs.observe,
  }
}
