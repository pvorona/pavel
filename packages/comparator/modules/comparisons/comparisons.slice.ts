import { createSlice } from '@pavel/redux-slice'
import { insertAt, remove, removeAt, uuid } from '@pavel/utils'
import { Option, addOption } from '../options'
import { ComparisonsState, Feature } from './types'

export const comparisonsSlice = createSlice({
  name: 'comparisons',
  initialState: {
    byId: {
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
    },
    currentComparisonId: 'comparison 1',
  } as ComparisonsState,
  handlers: {
    addFeatureToCurrentComparison: (state, index: number) => {
      const newFeature: Feature = {
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

      const currentComparison = state.byId[state.currentComparisonId]
      const features = [...currentComparison.features]

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            features: insertAt(features, index, newFeature),
          },
        },
      }
      // TODO
      // setShouldScrollToBottom(true)
    },
    addOptionIdToCurrentComparison: (
      state,
      { id, index }: { id: string; index: number },
    ) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const optionIds = [...currentComparison.optionIds]

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            optionIds: insertAt(optionIds, index, id),
          },
        },
      }
    },
    removeFeatureFromCurrentComparison: (state, index: number) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const features = [...currentComparison.features]

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            features: removeAt(features, index),
          },
        },
      }
    },
    toggleFeatureExpandedInCurrentComparison: (state, index: number) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const features = currentComparison.features.map((feature, i) =>
        i === index ? { ...feature, isExpanded: !feature.isExpanded } : feature,
      )

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            features,
          },
        },
      }
    },
    toggleDescriptionExpandedInCurrentComparison: (state, index: number) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const features = currentComparison.features.map((feature, i) =>
        i === index
          ? {
              ...feature,
              isDescriptionExpanded: !feature.isDescriptionExpanded,
            }
          : feature,
      )

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            features,
          },
        },
      }
    },
    removeOptionFromCurrentComparison: (state, id: string) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const optionIds = [...currentComparison.optionIds]

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            optionIds: remove(optionIds, id),
          },
        },
      }
    },
    setFeatureProperty: (
      state,
      { id, ...change }: Partial<Feature> & { id: string },
    ) => {
      const currentComparison = state.byId[state.currentComparisonId]
      const features = currentComparison.features.map(f =>
        f.id === id ? { ...f, ...change } : f,
      )

      return {
        ...state,
        byId: {
          ...state.byId,
          [currentComparison.id]: {
            ...currentComparison,
            features,
          },
        },
      }
    },
  },
})

export function addOptionToCurrentComparison(index: number) {
  const id = uuid()
  const newOption: Option = {
    id,
    name: `Option ${index}`,
    features: {},
  }

  return function (dispatch) {
    dispatch([
      addOption(newOption),
      addOptionIdToCurrentComparison({ id, index }),
    ])
  }
}

export const {
  addFeatureToCurrentComparison,
  addOptionIdToCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleFeatureExpandedInCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
  removeOptionFromCurrentComparison,
  setFeatureProperty,
} = comparisonsSlice.actions
