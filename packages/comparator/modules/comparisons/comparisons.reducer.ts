import { combineReducers } from 'redux'
import { comparisonsByIdSlice } from './comparisonsById.slice'
import { currentComparisonIdSlice } from './currentComparisonId.slice'

export const comparisonsReducer = combineReducers({
  byId: comparisonsByIdSlice.reducer,
  currentComparisonId: currentComparisonIdSlice.reducer,
})
