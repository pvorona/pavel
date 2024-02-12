import { Getter, Lambda, Setter } from '@pavel/types'

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type Observable<T> = EagerObservable<T> | LazyObservable

export type Gettable<T> = {
  get: Getter<T>
}

export type Settable<T> = {
  set: Setter<T>
}

export type Identifiable<T = string> = { id: T }

export type EagerSubject<T> = EagerObservable<T> &
  Gettable<T> &
  Settable<T> &
  Identifiable

export type LazySubject<T> = LazyObservable &
  Gettable<T> &
  Settable<T> &
  Identifiable

export type ReadonlyEagerSubject<T> = EagerObservable<T> &
  Gettable<T> &
  Identifiable

export type ReadonlyLazySubject<T> = LazyObservable & Gettable<T> & Identifiable

export type ReadonlySubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type ObservedTypeOf<T extends Observable<unknown> | Gettable<unknown>> =
  T extends Observable<infer K> | Gettable<infer K> ? K : never

export type ObservedTypesOf<
  T extends Observable<unknown>[] | Gettable<unknown>[],
> = {
  [K in keyof T]: T[K] extends Observable<infer K> | Gettable<infer K>
    ? K
    : never
  // [K in keyof T]: ObservedTypeOf<T[K]>
}
