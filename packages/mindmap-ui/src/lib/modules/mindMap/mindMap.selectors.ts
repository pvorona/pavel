import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { selectRootNode } from '../tree'
import { computeGeometry, createPositionedTree } from './mindMap.utils'

const selectMindMapState = (state: RootState) => state.mindMap

export const selectScale = createSelector(
  selectMindMapState,
  mindMapState => mindMapState.scale,
)

export const selectTranslateX = createSelector(
  selectMindMapState,
  mindMapState => mindMapState.translateX,
)

export const selectTranslateY = createSelector(
  selectMindMapState,
  mindMapState => mindMapState.translateY,
)

export const selectIsSliderVisible = createSelector(
  selectMindMapState,
  mindMapState => mindMapState.isSliderVisible,
)

export const selectPositionedTree = createSelector(selectRootNode, rootNode =>
  rootNode ? createPositionedTree(rootNode) : null,
)
