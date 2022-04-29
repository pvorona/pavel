import { createStore, applyMiddleware } from 'redux'
import { mindMapMiddleware, viewModeMiddleware } from '../modules'
import {
  observeTreeMiddleware,
  updateTreeMiddleware,
} from '../modules/tree/tree.middleware'
import { reducer } from './reducer'

const store = createStore(
  reducer,
  applyMiddleware(
    viewModeMiddleware,
    updateTreeMiddleware,
    observeTreeMiddleware,
    mindMapMiddleware,
  ),
)

export const makeStore = (preloadedState: Partial<RootState>) =>
  createStore(
    reducer,
    preloadedState,
    applyMiddleware(
      viewModeMiddleware,
      updateTreeMiddleware,
      observeTreeMiddleware,
      mindMapMiddleware,
    ),
  )

export type RootState = ReturnType<typeof store.getState>
