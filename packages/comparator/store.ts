import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { optionsSlice } from './modules/options'
import { comparisonsSlice } from './modules/comparisons'
import { batchReducer, batchMiddleware } from '@pavel/redux-slice'

export const store = createStore(
  batchReducer(
    combineReducers({
      options: optionsSlice.reducer,
      comparisons: comparisonsSlice.reducer,
    }),
  ),
  applyMiddleware(batchMiddleware, thunk),
)
