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
  observer: (...args: ObservedTypesOf<T>) => void | Lambda,
  options?: CollectingValuesOptions,
): Lambda
// export function observe<T extends ReadonlyEagerSubject<unknown>[]>(
//   deps: readonly [...T],
//   observer: (...args: ObservedTypesOf<T>) => void | Lambda,
//   options?: CollectingValuesOptions,
// ): Lambda
export function observe<T extends ReadonlySubject<unknown>[]>(
  deps: readonly [...T],
  observer: () => void | Lambda,
  options?: NotCollectingValuesOptions,
): Lambda
export function observe(
  deps: readonly ReadonlySubject<unknown>[],
  externalObserver: (...args: unknown[]) => void | Lambda,
  {
    fireImmediately = DEFAULT_OPTIONS.fireImmediately,
    collectValues = DEFAULT_OPTIONS.collectValues,
  }: ObserveOptions = DEFAULT_OPTIONS,
): Lambda {
  let cleanup: Lambda | void

  const observer = createObserver(externalObserver, deps, collectValues)
  const observerWithCleanup = () => {
    if (cleanup) {
      cleanup()
    }

    cleanup = observer()
  }

  const unobserves = deps.map(dep => dep.observe(observerWithCleanup))

  if (fireImmediately) {
    observerWithCleanup()
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}

function createObserver(
  observer: (...args: unknown[]) => void,
  deps: readonly ReadonlySubject<unknown>[],
  collectValues: boolean | undefined,
): (...args: unknown[]) => void | Lambda {
  if (collectValues) {
    return () => observer(...collectValuesUtil(deps))
  }

  return observer
}
