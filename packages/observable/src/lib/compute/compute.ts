import { observable } from '../observable'
import { observe } from '../observe'
import {
  EagerObservable,
  Gettable,
  InferTypeParams,
  Observable,
} from '../types'

export function compute<
  A extends (Observable<unknown> & Gettable<unknown>)[],
  T,
>(
  deps: readonly [...A],
  compute: (...args: InferTypeParams<A>) => T,
): EagerObservable<T> & Gettable<T> {
  const obs = observable(undefined as unknown as T)

  observe(deps, (...values) => {
    obs.set(compute(...values))
  })

  return {
    get: obs.get,
    observe: obs.observe,
  }
}
