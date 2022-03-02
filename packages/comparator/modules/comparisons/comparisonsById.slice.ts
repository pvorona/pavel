import { createSlice } from '@pavel/redux-slice'
import { insertAt, remove, removeAt, uuid } from '@pavel/utils'
import { Option, addOption } from '../options'
import { selectCurrentComparisonId } from './comparisons.selectors'
import { ComparisonsState, Feature } from './types'

function createFeature(): Feature {
  return {
    id: uuid(),
    name: '',
    type: 'text',
    description: '',
    isDescriptionExpanded: false,
    isExpanded: true,
    // new: true,
    // TODO
    // Highlight new features
    // Focus input and select text when new feature is added
  }
}

export const comparisonsByIdSlice = createSlice({
  name: 'comparisons.byId',
  initialState: {
    'comparison 1': {
      id: 'comparison 1',
      name: 'current comparison',
      optionIds: ['option 1', 'option 2'],
      isLocked: false,
      features: [
        {
          id: 'feature 1',
          name: 'Price',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
        {
          id: 'feature 2',
          name: 'Diagonal',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
        {
          id: 'feature 3',
          name: 'Offer',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
        {
          id: 'feature 4',
          name: 'Contact',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
        {
          id: 'feature 5',
          name: 'Website',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
        {
          id: 'feature 6',
          name: 'Note',
          description: '',
          type: 'text',
          isExpanded: true,
          isDescriptionExpanded: false,
        },
      ],
    },
  } as ComparisonsState['byId'],
  handlers: {
    addFeatureToComparison: (
      state,
      { id, index }: { id: string; index: number },
    ) => {
      const newFeature = createFeature()
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

export function addOptionToCurrentComparison(index: number) {
  const optionId = uuid()
  const newOption: Option = {
    id: optionId,
    name: `Option ${index}`,
    features: {},
  }
  return function (dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())

    dispatch([
      addOption(newOption),
      addOptionIdToComparison({
        index,
        optionId,
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

export const {
  addFeatureToComparison,
  addOptionIdToComparison,
  removeFeatureFromComparison,
  toggleFeatureExpandedInComparison,
  toggleDescriptionExpandedInComparison,
  removeOptionIdFromComparison,
  setFeaturePropertyInComparison,
} = comparisonsByIdSlice.actions
