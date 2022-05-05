import { mindMapReducer, treeReducer, viewModeReducer } from '../modules'
import { combineReducers } from '@reduxjs/toolkit'

export const reducer = combineReducers({
  viewMode: viewModeReducer,
  mindMap: mindMapReducer,
  tree: treeReducer,
})
