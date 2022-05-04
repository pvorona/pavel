import { RootState } from '../../store'
import { createSelector } from 'reselect'
import { selectRootNode } from '../tree'
import { computeGeometry } from './mindMap.utils'

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
  rootNode ? computeGeometry(rootNode) : null,
)
