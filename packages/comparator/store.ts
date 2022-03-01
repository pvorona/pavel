import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import thunk from 'redux-thunk'
import { optionsSlice } from './modules/options'
import { comparisonsSlice } from './modules/comparisons'

const BATCH = 'BATCH'

export const store = createStore(
  batchReducer(
    combineReducers({
      options: optionsSlice.reducer,
      comparisons: comparisonsSlice.reducer,
    }),
  ),
  applyMiddleware(thunk, batchMiddleware),
)

function batchReducer(reducer: Reducer): Reducer {
  return function batchingReducer(state, action) {
    if (action.type !== BATCH) {
      return reducer(state, action)
    }

    return action.actions.reduce(
      (temporalState, action) => reducer(temporalState, action),
      state,
    )
  }
}

function batchMiddleware() {
  return next => action => {
    if (!Array.isArray(action)) {
      return next(action)
    }

    next({ type: BATCH, actions: action })
  }
}
