import { Lambda } from '../types'

export type Transition<A> = {
  getCurrentValue: () => A
  setTargetValue: (target: A) => void
  hasCompleted: () => boolean
}

export type TransitionV2<T> = {
  // onStart: (listener: Lambda) => Lambda
  // onTick: (listener: (value: T) => void) => Lambda
  // onComplete: (listener: Lambda) => Lambda
  // start: Lambda
  // pause: Lambda
  // resume: Lambda
  stop: ()=>T
}
