import { Lambda } from '@pavel/types'

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type Observable<T> = EagerObservable<T> | LazyObservable

export type ReadOnly<T> = {
  readonly value: T
}

export type Writable<T> = {
  value: T
}

export type Named = Readonly<{ name: string }>

export type EagerSubject<T> = EagerObservable<T> & Writable<T> & Named

export type LazySubject<T> = LazyObservable & Writable<T> & Named

export type ReadonlyEagerSubject<T> = EagerObservable<T> & ReadOnly<T> & Named

export type ReadonlyLazySubject<T> = LazyObservable & ReadOnly<T> & Named

export type ReadonlySubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type ObservedTypeOf<T extends Observable<unknown> | ReadOnly<unknown>> =
  T extends Observable<infer K> | ReadOnly<infer K> ? K : never

export type ObservedTypesOf<
  T extends Observable<unknown>[] | ReadOnly<unknown>[],
> = {
  [K in keyof T]: T[K] extends Observable<infer K> | ReadOnly<infer K>
    ? K
    : never
}
