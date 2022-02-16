import { Lambda } from '@pavel/types'

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = WithTag & {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = WithTag & {
  observe: (observer: Lambda) => Lambda
}

export type Settable<A> = {
  set: (value: A | ((prevValue: A) => A)) => void
}

export type Gettable<A> = {
  get: () => A
}

export type Named = Readonly<{ name: string }>

export const ObservableTag = Symbol('Observable')

export type WithTag = { [ObservableTag]: true }

export function isObservable<T>(
  dependency: unknown,
): dependency is Observable<T> {
  return (
    typeof dependency === 'object' &&
    dependency !== null &&
    ObservableTag in dependency
  )
}

export type EagerSubject<T> = EagerObservable<T> &
  Settable<T> &
  Gettable<T> &
  Named

export type ReadonlyEagerSubject<T> = EagerObservable<T> & Gettable<T> & Named

export type ReadonlyLazySubject<T> = LazyObservable & Gettable<T> & Named

export type ReadonlySubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type Observable<T> = EagerObservable<T> | LazyObservable

export type ObservedTypeOf<T extends Observable<unknown> | Gettable<unknown>> =
  T extends Observable<infer K> | Gettable<infer K> ? K : never

export type ObservedTypesOf<
  T extends
    | (Observable<unknown>[] | Gettable<unknown>[])
    | (Observable<unknown[]> | Gettable<unknown[]>),
> = T extends Observable<infer K> | Gettable<infer K>
  ? K
  : {
      [K in keyof T]: T[K] extends Observable<infer K> | Gettable<infer K>
        ? K
        : never
    }
