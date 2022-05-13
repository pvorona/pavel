import { Lambda } from '@pavel/types'
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

export type InertOptions =
  | (TransitionTimingOptionsObject & Partial<Identifiable>)
  | number

export type AnimatableValue = number

export type AnyAnimatableValue = AnimatableValue | any

export type AnimatableSubject<T> =
  | ReadonlyEagerSubject<T>
  | ReadonlyLazySubject<T>

export type AnyAnimatableSubject = AnimatableSubject<AnyAnimatableValue>

export type TargetDescriptor<T extends AnyAnimatableSubject> = {
  target: T
  interpolate: Interpolate<ObservedTypeOf<T>>
}

export type TargetOrTargetDescriptor<T extends AnyAnimatableSubject> =
  T extends AnimatableSubject<AnimatableValue> ? T : TargetDescriptor<T>

export type InertSubject<T> = LazySubject<T> & {
  setTransition: (options: TransitionTimingOptions) => void
  complete: Lambda
}
