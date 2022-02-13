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

export type Transition<A> = {
  getCurrentValue: () => A
  setTargetValue: (target: A) => void
  hasNewValue: () => boolean
  setOptions: (options: TransitionTimingOptions) => void
}

type TransitionV4<T> = {
  getCurrentValue: () => { value: T, hasCompleted: boolean }
  setTargetValue: (target: T) => { value: T, hasCompleted: boolean }
  setOptions: (options: TransitionTimingOptions) => { value: T, hasCompleted: boolean }
}

type TimelessTransition<T> = {
  getValueAt: (timestamp: number) => { value: T, hasCompleted: boolean }
  setTargetValueAt: (timestamp: number, target: T) => { hasCompleted: boolean }
  setOptionsAt: (timestamp: number, options: TransitionTimingOptions) => { hasCompleted: boolean }
}
