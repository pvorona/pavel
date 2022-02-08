import { collectValues as collectValuesUtil } from '../utils'
import { Lambda, Observable, Gettable, ObservedTypesOf } from '../types'

export type ObserveOptions = {
  readonly collectValues?: boolean
  readonly fireImmediately?: boolean
}

type CollectingValuesOptions =
  | (ObserveOptions & {
      readonly collectValues: true
    })
  | { readonly fireImmediately?: boolean }

type NotCollectingValuesOptions = ObserveOptions & {
  readonly collectValues: false
}

const DEFAULT_OPTIONS: ObserveOptions = {
  collectValues: true,
  fireImmediately: true,
}

export function observe<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: ObservedTypesOf<T>) => void,
  options?: CollectingValuesOptions,
): Lambda
export function observe<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: () => void,
  options?: NotCollectingValuesOptions,
): Lambda
export function observe(
  deps: readonly (Observable<unknown> & Gettable<unknown>)[],
  externalObserver: (...args: unknown[]) => void,
  {
    fireImmediately = DEFAULT_OPTIONS.fireImmediately,
    collectValues = DEFAULT_OPTIONS.collectValues,
  }: ObserveOptions = DEFAULT_OPTIONS,
): Lambda {
  // Negate to prevent function allocation when possible
  const observer = !collectValues
    ? externalObserver
    : () => externalObserver(...collectValuesUtil(deps))
  const unobserves = deps.map(dep => dep.observe(observer))

  if (fireImmediately) {
    observer()
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}
