import { Lambda, RecordKey } from '@pavel/types'
import {
  Interpolate,
  TransitionTimingOptions,
  TransitionTimingOptionsObject,
} from '../transition'
import {
  ReadonlyEagerSubject,
  ReadonlyLazySubject,
  Identifiable,
  LazySubject,
  ObservedTypeOf,
} from '../types'

export type InertOptions<T extends AnimatableSubject<unknown>> =
  (TransitionTimingOptionsObject & Partial<Identifiable>) & {
    readonly target: T
    readonly interpolate?: Interpolate<ObservedTypeOf<T>>
  }

export type AnimatableValue =
  | number
  | { readonly [key: RecordKey]: AnimatableValue }

export type AnimatableSubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type InertSubject<T> = LazySubject<T> & {
  setTransition: (options: TransitionTimingOptions) => void
  complete: Lambda
}
