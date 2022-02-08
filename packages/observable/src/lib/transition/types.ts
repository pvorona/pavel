export type Transition<A> = {
  getCurrentValue: () => A
  setTargetValue: (target: A) => void
  hasCompleted: () => boolean
}
