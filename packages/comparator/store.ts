import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { optionsSlice } from './modules/options'
import { comparisonsSlice } from './modules/comparisons'
// import { RootState } from './types'

export const store = createStore(
  combineReducers({
    options: optionsSlice.reducer,
    comparisons: comparisonsSlice.reducer,
  }),
  applyMiddleware(thunk),
)
