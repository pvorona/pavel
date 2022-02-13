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

type TimelessTransition<T> = {
  getValueAt: (timestamp: number) => T
  hasCompletedAt: (timestamp: number) => boolean
  setTargetValueAt: (timestamp: number, target: T) => void
  setOptionsAt: (timestamp: number, options: TransitionTimingOptions) => void
}
