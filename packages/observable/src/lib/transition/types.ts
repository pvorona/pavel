import { Easing } from '@pavel/easing'

export type Interpolate<T> = (startValue: T, endValue: T, progress: number) => T

export type TransitionTimingOptionsObject = {
  duration: number
  easing?: Easing
}

export type TransitionOptionsObject<T> = TransitionTimingOptionsObject & {
  interpolate: Interpolate<T>
}

export type TransitionTimingOptions = TransitionTimingOptionsObject | number

export type TransitionTiming = {
  duration: number
  easing: Easing
}

export type TransitionOptions<T> = TransitionOptionsObject<T> & {
  initialValue: T
}

export type Transition<T> = {
  getCurrentValue: () => { value: T; hasCompleted: boolean }
  setTargetValue: (target: T) => { hasCompleted: boolean }
  setOptions: (options: TransitionTimingOptions) => { hasCompleted: boolean }
  setInstant: (target: T) => { hasCompleted: boolean }
}

// Todo
export type TimelessTransition<T> = {
  getValue: (timestamp: DOMHighResTimeStamp) => {
    value: T
    hasCompleted: boolean
  }
  setTargetValue: (
    timestamp: DOMHighResTimeStamp,
    target: T,
  ) => { hasCompleted: boolean }
  setOptions: (
    timestamp: DOMHighResTimeStamp,
    options: TransitionTimingOptions,
  ) => { hasCompleted: boolean }
}
