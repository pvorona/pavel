import { createSelector } from 'reselect'
import { OptionsState } from './types'
import { selectCurrentComparisonOptionIds } from '../comparisons'

const selectOptionsState = (state): OptionsState => state.options

const selectOptionsByIdState = createSelector(
  selectOptionsState,
  optionsState => optionsState.byId,
)

export const selectCurrentComparisonOptions = createSelector(
  selectCurrentComparisonOptionIds,
  selectOptionsByIdState,
  (optionIds, optionById) => {
    return optionIds.map(optionId => optionById[optionId])
  },
)
