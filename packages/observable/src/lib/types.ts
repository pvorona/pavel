import { Lambda } from '@pavel/types'

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type Observable<T> = EagerObservable<T> | LazyObservable

export type ReadableValue<T> = {
  readonly value: T
}

export type ReadableWritableValue<T> = {
  value: T
}

export type Named = Readonly<{ name: string }>

export type EagerSubject<T> = EagerObservable<T> &
  ReadableWritableValue<T> &
  Named

export type LazySubject<T> = LazyObservable & ReadableWritableValue<T> & Named

export type ReadonlyEagerSubject<T> = EagerObservable<T> &
  ReadableValue<T> &
  Named

export type ReadonlyLazySubject<T> = LazyObservable & ReadableValue<T> & Named

export type ReadonlySubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type ObservedTypeOf<
  T extends Observable<unknown> | ReadableValue<unknown>,
> = T extends Observable<infer K> | ReadableValue<infer K> ? K : never

export type ObservedTypesOf<
  T extends Observable<unknown>[] | ReadableValue<unknown>[],
> = {
  [K in keyof T]: T[K] extends Observable<infer K> | ReadableValue<infer K>
    ? K
    : never
}
