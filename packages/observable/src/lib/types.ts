export type Lambda = () => void

export type Observer<A> = (value: A) => void

export type EagerObservable<T> = {
  observe: (observer: Observer<T>) => Lambda
}

export type LazyObservable = {
  observe: (observer: Lambda) => Lambda
}

export type Settable<A> = {
  set: (value: A | ((prevValue: A) => A)) => void
}

export type Gettable<A> = {
  get: () => A
}

export type EagerSubject<T> = EagerObservable<T> & Settable<T> & Gettable<T>

export type ReadonlyEagerSubject<T> = EagerObservable<T> & Gettable<T>

export type ReadonlyLazySubject<T> = LazyObservable & Gettable<T>

export type ReadonlySubject<T> = Observable<T> & Gettable<T>

export type Observable<T> = EagerObservable<T> | LazyObservable

export type ObservedTypesOf<
  T extends Observable<unknown>[] | Gettable<unknown>[],
> = {
  [K in keyof T]: T[K] extends Observable<infer K> | Gettable<infer K>
    ? K
    : never
}

export type ObservedTypeOf<
  T extends EagerObservable<unknown> | Gettable<unknown>,
> = T extends EagerObservable<infer K> | Gettable<infer K> ? K : never
