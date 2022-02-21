import { Lambda } from '@pavel/types'

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type ValueOrUpdater<T> = T | ((prevValue: T) => T)

export type Settable<T> = {
  set: (valueOrUpdater: ValueOrUpdater<T>) => void
}

export type Gettable<A> = {
  get: () => A
}

export type Named = Readonly<{ name: string }>

export type EagerSubject<T> = EagerObservable<T> &
  Settable<T> &
  Gettable<T> &
  Named

export type LazySubject<T> = LazyObservable & Settable<T> & Gettable<T> & Named

export type ReadonlyEagerSubject<T> = EagerObservable<T> & Gettable<T> & Named

export type ReadonlyLazySubject<T> = LazyObservable & Gettable<T> & Named

export type ReadonlySubject<T> = Observable<T> & Gettable<T>

export type Observable<T> = EagerObservable<T> | LazyObservable

export type ObservedTypeOf<T extends Observable<unknown> | Gettable<unknown>> =
  T extends Observable<infer K> | Gettable<infer K> ? K : never

export type ObservedTypesOf<
  T extends Observable<unknown>[] | Gettable<unknown>[],
> = {
  [K in keyof T]: T[K] extends Observable<infer K> | Gettable<infer K>
    ? K
    : never
}
