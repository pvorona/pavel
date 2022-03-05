import { createSlice } from '@pavel/redux-slice'
import { insertAt, remove, removeAt } from '@pavel/utils'
import { buildFeature } from './comparisons.factories'
import { Comparison, ComparisonsState, Feature } from './types'
import { addOption } from '../options'
import { selectCurrentComparisonId } from './comparisons.selectors'
import { buildComparison, createOption } from './comparisons.factories'
import { setCurrentComparisonId } from './currentComparisonId.slice'

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
      { id, index }: { id: string; index: number },
    ) => {
      const comparison = state[id]
      const features = [...comparison.features]

      return {
        ...state,
        [comparison.id]: {
          ...comparison,
          features: removeAt(features, index),
        },
      }
    },
    toggleFeatureExpandedInComparison: (
      state,
      { id, index }: { id: string; index: number },
    ) => {
      const comparison = state[id]
      const features = comparison.features.map((feature, i) =>
        i === index ? { ...feature, isExpanded: !feature.isExpanded } : feature,
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
      { id, index }: { id: string; index: number },
    ) => {
      const comparison = state[id]
      const features = comparison.features.map((feature, i) =>
        i === index
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
} = comparisonsByIdSlice.actions

export function addOptionToCurrentComparison(index: number) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())
    const option = createOption()

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

export function removeFeatureFromCurrentComparison(index: number) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      removeFeatureFromComparison({
        id: currentComparisonId,
        index,
      }),
    )
  }
}

export function toggleFeatureExpandedInCurrentComparison(index: number) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      toggleFeatureExpandedInComparison({
        id: currentComparisonId,
        index,
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

export function toggleDescriptionExpandedInCurrentComparison(index: number) {
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch(
      toggleDescriptionExpandedInComparison({
        id: currentComparisonId,
        index,
      }),
    )
  }
}

export function initNewComparison() {
  return function (dispatch) {
    const option1 = createOption({ name: 'Option A' })
    const option2 = createOption({ name: 'Option B' })
    const comparison: Comparison = {
      ...buildComparison({ isNew: true }),
      optionIds: [option1.id, option2.id],
      features: [buildFeature()],
    }

    dispatch([
      addOption(option1),
      addOption(option2),
      addComparison(comparison),
      setCurrentComparisonId(comparison.id),
    ])
  }
}
