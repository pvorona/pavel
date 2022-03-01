import { ComparisonsState } from './types'
import { createSelector } from 'reselect'

const selectComparisonsState = (state): ComparisonsState => state.comparisons

const selectCurrentComparisonId = createSelector(
  selectComparisonsState,
  comparisonsState => comparisonsState.currentComparisonId,
)

const selectComparisonsByIdState = createSelector(
  selectComparisonsState,
  comparisonsState => comparisonsState.byId,
)

export const selectCurrentComparison = createSelector(
  selectComparisonsByIdState,
  selectCurrentComparisonId,
  (comparisonsById, currentComparisonId) =>
    comparisonsById[currentComparisonId],
)

export const selectCurrentComparisonOptionIds = createSelector(
  selectCurrentComparison,
  currentComparison => currentComparison.optionIds,
)
