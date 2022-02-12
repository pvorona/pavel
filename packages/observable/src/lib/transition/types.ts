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
  hasCompleted: () => boolean
  setOptions: (options: TransitionTimingOptions) => void
}
