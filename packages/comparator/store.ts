import {
  createStore,
  combineReducers,
  applyMiddleware,
  Dispatch,
  AnyAction,
} from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import {
  authReducer,
  comparisonsReducer,
  comparisonTableReducer,
  optionsReducer,
} from './modules'
import { batchReducer, batchMiddleware } from '@pavel/redux-slice'

export const store = createStore(
  batchReducer(
    combineReducers({
      auth: authReducer,
      options: optionsReducer,
      comparisons: comparisonsReducer,
      comparisonTable: comparisonTableReducer,
    }),
  ),
  applyMiddleware(batchMiddleware, thunk),
)

export type RootState = ReturnType<typeof store.getState>
