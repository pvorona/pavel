import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {
  comparisonsReducer,
  comparisonTableReducer,
  optionsReducer,
} from './modules'
import { batchReducer, batchMiddleware } from '@pavel/redux-slice'

export const store = createStore(
  batchReducer(
    combineReducers({
      options: optionsReducer,
      comparisons: comparisonsReducer,
      comparisonTable: comparisonTableReducer,
    }),
  ),
  applyMiddleware(batchMiddleware, thunk),
)
