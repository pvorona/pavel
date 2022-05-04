import { combineReducers } from 'redux'
import { mindMapReducer, treeReducer, viewModeReducer } from '../modules'

export const reducer = combineReducers({
  viewMode: viewModeReducer,
  mindMap: mindMapReducer,
  tree: treeReducer,
})
