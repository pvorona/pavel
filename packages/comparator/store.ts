import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { optionsReducer } from './modules/options'
import { comparisonsReducer } from './modules/comparisons'
import { batchReducer, batchMiddleware } from '@pavel/redux-slice'

export const store = createStore(
  batchReducer(
    combineReducers({
      options: optionsReducer,
      comparisons: comparisonsReducer,
    }),
  ),
  applyMiddleware(batchMiddleware, thunk),
)