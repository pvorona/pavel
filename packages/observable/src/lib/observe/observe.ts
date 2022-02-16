import { collectValues as collectValuesUtil } from '../utils'
import { Lambda } from '@pavel/types'
import { isObservable, ObservedTypesOf, ReadonlySubject } from '../types'
import { invokeAll } from '@pavel/utils'

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

export function observe<
  T extends ReadonlySubject<unknown>[] | ReadonlySubject<unknown[]>,
>(
  dependencies: T,
  observer: (...args: ObservedTypesOf<T>) => void,
  options?: CollectingValuesOptions,
): Lambda
export function observe<
  T extends ReadonlySubject<unknown>[] | ReadonlySubject<unknown[]>,
>(
  dependencies: T,
  observer: () => void,
  options?: NotCollectingValuesOptions,
): Lambda
export function observe(
  dependencies: ReadonlySubject<unknown>[] | ReadonlySubject<unknown[]>,
  externalObserver: (...args: unknown[]) => void,
  {
    fireImmediately = DEFAULT_OPTIONS.fireImmediately,
    collectValues = DEFAULT_OPTIONS.collectValues,
  }: ObserveOptions = DEFAULT_OPTIONS,
): Lambda {
  const observer = createObserver(externalObserver, dependencies, collectValues)
  let unobserves: Lambda[] = []

  if (Array.isArray(dependencies)) {
    unobserves = dependencies.map(dep => dep.observe(observer))
  } else {
    dependencies.observe(() => {
      observer()

      if (unobserves.length !== 0) {
        invokeAll(unobserves)
        unobserves.length = 0
      }

      // No need to re-observe all dependencies
      // Only changed ones is enough
      dependencies.get().map(dependency => {
        if (isObservable(dependency)) {
          unobserves.push(dependency.observe(observer))
        }
      })
    })
  }

  if (fireImmediately) {
    observer()
  }

  return () => {
    unobserves.forEach(unobserve => unobserve())
  }
}

function createObserver(
  observer: (...args: unknown[]) => void,
  deps: ReadonlySubject<unknown>[] | ReadonlySubject<unknown[]>,
  collectValues: boolean | undefined,
): (...args: never[]) => void {
  if (collectValues) {
    return function collectingObserver() {
      if (Array.isArray(deps)) {
        return observer(...collectValuesUtil(deps))
      }

      return observer(...deps.get())
    }
  }

  return observer
}

// function getDependenciesArray(
//   dependenciesOrObservableArray:
//     | ReadonlySubject<unknown>[]
//     | ReadonlySubject<unknown[]>,
// ) {
//   if (Array.isArray(dependenciesOrObservableArray)) {
//     return dependenciesOrObservableArray
//   }

//   return dependenciesOrObservableArray.get()
// }
