import { Easing } from '@pavel/easing'
import { ReadonlyEagerSubject, ReadonlyLazySubject } from '../types'

export type InertOptions =
  | {
      duration: number
      easing?: Easing
    }
  | number

export type AnimatableValue = number

type Collection<T> = Record<string, T>

export type AnimatableCollection = Collection<AnimatableValue>

export type AnimatableTarget =
  | ReadonlyEagerSubject<AnimatableValue>
  | ReadonlyEagerSubject<AnimatableCollection>
  | ReadonlyLazySubject<AnimatableValue>
  | ReadonlyLazySubject<AnimatableCollection>

export type InertSubject<T> = ReadonlyLazySubject<T> & {
  setTransition: (options: InertOptions) => void
}
