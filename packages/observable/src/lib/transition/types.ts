import { Easing } from '@pavel/easing'

export type TransitionTimingOptionsObject = {
  duration: number
  easing?: Easing
}

export type TransitionTimingOptions = TransitionTimingOptionsObject | number

export type TransitionTiming = {
  duration: number
  easing: Easing
}

export type Transition<T> = {
  getCurrentValue: () => { value: T; hasCompleted: boolean }
  setTargetValue: (target: T) => { hasCompleted: boolean }
  setOptions: (options: TransitionTimingOptions) => { hasCompleted: boolean }
  setInstant: (target: T) => { hasCompleted: boolean }
}

export type TimelessTransition<T> = {
  getValue: (timestamp: number) => { value: T; hasCompleted: boolean }
  setTargetValue: (timestamp: number, target: T) => { hasCompleted: boolean }
  setOptions: (
    timestamp: number,
    options: TransitionTimingOptions,
  ) => { hasCompleted: boolean }
}
