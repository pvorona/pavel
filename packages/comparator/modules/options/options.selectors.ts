import { createSelector } from 'reselect'
import { OptionsState } from './types'

const selectOptionsState = (state): OptionsState => state.options

export const selectOptionsByIdState = createSelector(
  selectOptionsState,
  optionsState => optionsState.byId,
)

export const selectOptionById = (optionId: string) =>
  createSelector(selectOptionsByIdState, optionsById => optionsById[optionId])

export const selectOptionNameById = (optionId: string) =>
  createSelector(selectOptionById(optionId), option => option.name)

export const selectOptionFeatures = (optionId: string) =>
  createSelector(selectOptionById(optionId), option => option.features)

export const selectOptionFeatureValue = (optionId: string, featureId: string) =>
  createSelector(
    selectOptionFeatures(optionId),
    features => features[featureId] ?? '',
  )
