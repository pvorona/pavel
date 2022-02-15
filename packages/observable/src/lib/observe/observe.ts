import { collectValues as collectValuesUtil } from '../utils'
import { Lambda } from '@pavel/types'
import { ObservedTypesOf, ReadonlySubject } from '../types'

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

export function observe<T extends ReadonlySubject<unknown>[]>(
  deps: readonly [...T],
  observer: (...args: ObservedTypesOf<T>) => void,
  options?: CollectingValuesOptions,
): Lambda
export function observe<T extends ReadonlySubject<unknown>[]>(
  deps: readonly [...T],
  observer: () => void,
  options?: NotCollectingValuesOptions,
): Lambda
export function observe(
  deps: readonly ReadonlySubject<unknown>[],
  externalObserver: (...args: unknown[]) => void,
  {
    fireImmediately = DEFAULT_OPTIONS.fireImmediately,
    collectValues = DEFAULT_OPTIONS.collectValues,
  }: ObserveOptions = DEFAULT_OPTIONS,
): Lambda {
  const observer = createObserver(externalObserver, deps, collectValues)
  const unobserves = deps.map(dep => dep.observe(observer))

  if (fireImmediately) {
    observer()
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}

function createObserver(
  observer: (...args: unknown[]) => void,
  deps: readonly ReadonlySubject<unknown>[],
  collectValues: boolean | undefined,
): (...args: unknown[]) => void {
  if (collectValues) {
    return () => observer(...collectValuesUtil(deps))
  }

  return observer
}
