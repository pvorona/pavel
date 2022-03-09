import { Lambda } from '@pavel/types'
import {
  TransitionTimingOptions,
  TransitionTimingOptionsObject,
} from '../transition'
import {
  ReadonlyEagerSubject,
  ReadonlyLazySubject,
  Named,
  LazySubject,
} from '../types'

export type InertOptions =
  | (TransitionTimingOptionsObject & Partial<Named>)
  | number

export type AnimatableValue = number

type Collection<T> = Record<string, T>

export type AnimatableCollection = Collection<AnimatableValue>

export type AnimatableSubject =
  | ReadonlyEagerSubject<AnimatableValue>
  | ReadonlyEagerSubject<AnimatableCollection>
  | ReadonlyLazySubject<AnimatableValue>
  | ReadonlyLazySubject<AnimatableCollection>

export type InertSubject<T> = LazySubject<T> & {
  setTransition: (options: TransitionTimingOptions) => void
  complete: Lambda
}
