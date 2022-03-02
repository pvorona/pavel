import { combineReducers } from 'redux'
import { optionsByIdSlice } from './options.slice'

export const optionsReducer = combineReducers({
  byId: optionsByIdSlice.reducer,
})
