import { ComparisonsState } from './types'
import { createSelector } from 'reselect'
import { getLast } from '@pavel/utils'

const selectComparisonsState = (state): ComparisonsState => state.comparisons

export const selectCurrentComparisonId = createSelector(
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

export const selectCurrentComparisonFeatures = createSelector(
  selectCurrentComparison,
  currentComparison => currentComparison.features,
)

export const selectCurrentComparisonFeatureIds = createSelector(
  selectCurrentComparisonFeatures,
  features => features.map(feature => feature.id),
)

export const selectCurrentComparisonFeatureById = (featureId: string) =>
  createSelector(selectCurrentComparisonFeatures, features =>
    features.find(feature => feature.id === featureId),
  )

export const selectIsCurrentComparisonFeatureExpandedById = (
  featureId: string,
) =>
  createSelector(
    selectCurrentComparisonFeatureById(featureId),
    feature => feature.isExpanded,
  )

export const selectIsLastOptionInCurrentComparisonById = (optionId: string) =>
  createSelector(
    selectCurrentComparisonOptionIds,
    optionIds => getLast(optionIds) === optionId,
  )

export const selectCurrentComparisonOptionIndexById = (optionId: string) =>
  createSelector(selectCurrentComparisonOptionIds, optionIds =>
    optionIds.indexOf(optionId),
  )

export const selectCurrentComparisonFeatureIndexById = (featureId: string) =>
  createSelector(selectCurrentComparisonFeatures, features =>
    features.findIndex(feature => feature.id === featureId),
  )
