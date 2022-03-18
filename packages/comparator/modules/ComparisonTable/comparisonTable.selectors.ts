import { createSelector } from 'reselect'
import { RootState } from '../../types'

export const selectComparisonTableState = (state: RootState) =>
  state.comparisonTable

export const selectPreparingToRemoveOptionId = createSelector(
  selectComparisonTableState,
  comparisonTableState => comparisonTableState.optionIdToRemove,
)

export const selectIsPreparingToRemoveOptionById = (optionId: string) =>
  createSelector(
    selectPreparingToRemoveOptionId,
    preparingToRemoveOptionId => preparingToRemoveOptionId === optionId,
  )

export const selectOptionsSizeSize = createSelector(
  selectComparisonTableState,
  comparisonTableState => comparisonTableState.optionSizeMap,
)

const DEFAULT_SIZE = { width: 0, height: 0 }

export const selectOptionSizeById = (optionId: string) =>
  createSelector(selectOptionsSizeSize, optionsSizeSize =>
    optionId in optionsSizeSize ? optionsSizeSize[optionId] : DEFAULT_SIZE,
  )

export const selectTableSize = createSelector(
  selectComparisonTableState,
  comparisonTableState => comparisonTableState.tableSize,
)

export const selectHoverState = createSelector(
  selectComparisonTableState,
  comparisonTableState => comparisonTableState.hover,
)

export const selectIsLeftBlockHovered = createSelector(
  selectHoverState,
  hoverState => hoverState.leftBlock,
)

export const selectIsRightBlockHovered = createSelector(
  selectHoverState,
  hoverState => hoverState.rightBlock,
)
