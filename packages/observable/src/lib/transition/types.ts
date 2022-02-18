import { Easing } from '@pavel/easing'

export type TransitionTimingOptionsObject = {
  duration: number
  easing?: Easing
}

export type TransitionTimingOptions = TransitionTimingOptionsObject | number

export type TransitionTiming = Readonly<{
  duration: number
  delay: number
  easing: Easing
}>

type TransitionState = Readonly<{
  // value: number
  startValue: number
  targetValue: number
  startTime: number
}>

type TransitionObject = {
  timing: TransitionTiming
  state: TransitionState
}

function getTransitionValue(
  state: TransitionState,
  timing: TransitionTiming,
): { hasCompleted: boolean; value: number | TransitionState } {}

function setTargetValue(
  state: TransitionState,
  timing: TransitionTiming,
  target: number,
): { hasCompleted: boolean; value: number | TransitionState }


// function createTransitionObject

export type Transition<T> = {
  getCurrentValue: () => { value: T; hasCompleted: boolean }
  setTargetValue: (target: T) => { hasCompleted: boolean }
  setOptions: (options: TransitionTimingOptions) => { hasCompleted: boolean }
}

export type TimelessTransition<T> = {
  getValue: (timestamp: number) => { value: T; hasCompleted: boolean }
  setTargetValue: (timestamp: number, target: T) => { hasCompleted: boolean }
  setOptions: (
    timestamp: number,
    options: TransitionTimingOptions,
  ) => { hasCompleted: boolean }
}
