import { mindMapMiddleware, viewModeMiddleware } from '../modules'
import {
  observeTreeMiddleware,
  updateTreeMiddleware,
} from '../modules/tree/tree.middleware'
import { reducer } from './reducer'
import { CombinedState, configureStore, PreloadedState } from '@reduxjs/toolkit'
import { RootState } from './types'
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers'

export const makeStore = (
  preloadedState: PreloadedState<CombinedState<NoInfer<RootState>>>,
) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        viewModeMiddleware,
        updateTreeMiddleware,
        observeTreeMiddleware,
        mindMapMiddleware,
      ),
  })
