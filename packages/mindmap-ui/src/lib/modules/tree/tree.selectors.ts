import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'

const selectTreeState = (state: RootState) => state.tree

export const selectRootNode = createSelector(
  selectTreeState,
  treeState => treeState.root,
)

export const selectTreeId = createSelector(
  selectTreeState,
  treeState => treeState.id,
)
export const selectText = createSelector(
  selectTreeState,
  treeState => treeState.text,
)
