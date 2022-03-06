import { createSlice } from '@pavel/redux-slice'
import { insertAt, remove } from '@pavel/utils'
import {
  buildFeature,
  Comparison,
  Feature,
  createOption,
} from '@pavel/comparator-shared'
import { ComparisonsState } from './types'
import { addOption } from '../options'
import { selectCurrentComparisonId } from './comparisons.selectors'

export const comparisonsByIdSlice = createSlice({
  name: 'comparisons.byId',
  initialState: {} as ComparisonsState['byId'],
  handlers: {
    addComparison: (state, comparison: Comparison) => ({
      ...state,
      [comparison.id]: comparison,
    }),
    addFeatureToComparison: (
      state,
      { id, index }: { id: string; index: number },
    ) => {
      const newFeature = buildFeature()
      const comparison = state[id]
      const features = [...comparison.features]

      return {
        ...state,
        [id]: {
          ...comparison,
          features: insertAt(features, index, newFeature),
        },
      }
      // TODO
      // setShouldScrollToBottom(true)
    },
    addOptionIdToComparison: (
      state,
      { id, optionId, index }: { id: string; optionId: string; index: number },
    ) => {
      const comparison = state[id]
      const optionIds = [...comparison.optionIds]

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          optionIds: insertAt(optionIds, index, optionId),
        },
      }
    },
    removeFeatureFromComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const comparison = state[id]
      const features = comparison.features.filter(
        feature => feature.id !== featureId,
      )

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          features,
        },
      }
    },
    toggleFeatureExpandedInComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const comparison = state[id]
      const features = comparison.features.map(feature =>
        feature.id === featureId
          ? { ...feature, isExpanded: !feature.isExpanded }
          : feature,
      )

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          features,
        },
      }
    },
    toggleDescriptionExpandedInComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const comparison = state[id]
      const features = comparison.features.map(feature =>
        feature.id === featureId
          ? {
              ...feature,
              isDescriptionExpanded: !feature.isDescriptionExpanded,
            }
          : feature,
      )

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          features,
        },
      }
    },
    removeOptionIdFromComparison: (
      state,
      { id, optionId }: { id: string; optionId: string },
    ) => {
      const comparison = state[id]
      const optionIds = [...comparison.optionIds]

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          optionIds: remove(optionIds, optionId),
        },
      }
    },
    setFeaturePropertyInComparison: (
      state,
      {
        featureId,
        id,
        ...change
      }: Partial<Feature> & { featureId: string; id: string },
    ) => {
      const comparison = state[id]
      const features = comparison.features.map(feature =>
        feature.id === featureId ? { ...feature, ...change } : feature,
      )

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          features,
        },
      }
    },
    setComparisonProperty: (
      state,
      {
        comparisonId,
        payload,
      }: { comparisonId: string; payload: Partial<Comparison> },
    ) => ({
      ...state,
      [comparisonId]: {
        ...state[comparisonId],
        ...payload,
      },
    }),
  },
})

export const {
  addComparison,
  addFeatureToComparison,
  addOptionIdToComparison,
  removeFeatureFromComparison,
  toggleFeatureExpandedInComparison,
  toggleDescriptionExpandedInComparison,
  removeOptionIdFromComparison,
  setFeaturePropertyInComparison,
  setComparisonProperty,
} = comparisonsByIdSlice.actions

export function addOptionToCurrentComparison(index: number) {
  return async function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())
    const option = await createOption()

    dispatch([
      addOption(option),
      addOptionIdToComparison({
        index,
        optionId: option.id,
        id: currentComparisonId,
      }),
    ])
  }
}

export function addFeatureToCurrentComparison(index: number) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      addFeatureToComparison({
        index,
        id: currentComparisonId,
      }),
    )
  }
}

export function addOptionIdToCurrentComparison({
  optionId,
  index,
}: {
  optionId: string
  index: number
}) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      addOptionIdToComparison({
        index,
        optionId,
        id: currentComparisonId,
      }),
    )
  }
}

export function removeFeatureFromCurrentComparison(featureId: string) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      removeFeatureFromComparison({
        id: currentComparisonId,
        featureId,
      }),
    )
  }
}

export function toggleFeatureExpandedInCurrentComparison(featureId: string) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      toggleFeatureExpandedInComparison({
        id: currentComparisonId,
        featureId,
      }),
    )
  }
}

export function setFeaturePropertyInCurrentComparison(
  payload: { featureId: string } & Partial<Feature>,
) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      setFeaturePropertyInComparison({
        id: currentComparisonId,
        ...payload,
      }),
    )
  }
}

export function removeOptionIdFromCurrentComparison(optionId: string) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      removeOptionIdFromComparison({
        id: currentComparisonId,
        optionId,
      }),
    )
  }
}

export function toggleDescriptionExpandedInCurrentComparison(
  featureId: string,
) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      toggleDescriptionExpandedInComparison({
        id: currentComparisonId,
        featureId,
      }),
    )
  }
}

export function setCurrentComparisonProperty(payload: Partial<Comparison>) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      setComparisonProperty({
        comparisonId: currentComparisonId,
        payload,
      }),
    )
  }
}
