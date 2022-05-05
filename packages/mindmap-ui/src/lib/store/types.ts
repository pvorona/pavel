import { reducer } from './reducer'
import type { CombinedState } from '@reduxjs/toolkit'

type CleanState<T> = T extends CombinedState<infer S>
  ? { [K in keyof S]: CleanState<S[K]> }
  : T

export type RootState = CleanState<ReturnType<typeof reducer>>
