import { batch, createSlice } from '@pavel/redux-slice'
import { insertAt, removeAt } from '@pavel/utils'
import {
  buildFeature,
  Comparison,
  Feature,
  createOption,
} from '@pavel/comparator-shared'
import { ComparisonsState } from './types'
import { addOption } from '../options'
import { selectCurrentComparisonId } from './comparisons.selectors'
import { AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../../store'

export const comparisonsByIdSlice = createSlice({
  name: 'comparisons.byId',
  initialState: {} as ComparisonsState['byId'],
  reducers: {
    addComparison: (state, comparison: Comparison) => {
      state[comparison.id] = comparison
    },
    addFeatureToComparison: (
      state,
      { id, index }: { id: string; index: number },
    ) => {
      insertAt(state[id].features, index, buildFeature())
    },
    addOptionIdToComparison: (
      state,
      { id, optionId, index }: { id: string; optionId: string; index: number },
    ) => {
      insertAt(state[id].optionIds, index, optionId)
    },
    removeFeatureFromComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const index = state[id].features.findIndex(
        feature => feature.id === featureId,
      )
      removeAt(state[id].features, index)
    },
    toggleFeatureExpandedInComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const feature = state[id].features.find(
        feature => feature.id === featureId,
      )
      feature.isExpanded = !feature.isExpanded
    },
    toggleFeatureDescriptionExpandedInComparison: (
      state,
      { id, featureId }: { id: string; featureId: string },
    ) => {
      const feature = state[id].features.find(
        feature => feature.id === featureId,
      )
      feature.isDescriptionExpanded = !feature.isDescriptionExpanded
    },
    removeOptionIdFromComparison: (
      state,
      { id, optionId }: { id: string; optionId: string },
    ) => {
      const index = state[id].optionIds.findIndex(option => option === optionId)
      removeAt(state[id].optionIds, index)
    },
    setFeaturePropertyInComparison: (
      state,
      {
        featureId,
        id,
        ...change
      }: Partial<Feature> & { featureId: string; id: string },
    ) => {
      const feature = state[id].features.find(
        feature => feature.id === featureId,
      )
      Object.assign(feature, change)
    },
    setComparisonProperty: (
      state,
      {
        comparisonId,
        payload,
      }: { comparisonId: string; payload: Partial<Comparison> },
    ) => {
      Object.assign(state[comparisonId], payload)
    },
  },
})

export const {
  addComparison,
  addFeatureToComparison,
  addOptionIdToComparison,
  removeFeatureFromComparison,
  toggleFeatureExpandedInComparison,
  toggleFeatureDescriptionExpandedInComparison,
  removeOptionIdFromComparison,
  setFeaturePropertyInComparison,
  setComparisonProperty,
} = comparisonsByIdSlice.actions

export function addOptionToCurrentComparison({
  ownerId,
  index,
}: {
  ownerId: string
  index: number
}) {
  return async function (dispatch: Dispatch, getState) {
    const currentComparisonId = selectCurrentComparisonId(getState())
    const option = await createOption(ownerId)

    dispatch(
      batch([
        addOption(option),
        addOptionIdToComparison({
          index,
          optionId: option.id,
          id: currentComparisonId,
        }),
      ]),
    )
  }
}

export const addFeatureToCurrentComparison = (
  index: number,
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return function (dispatch: Dispatch, getState) {
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
      toggleFeatureDescriptionExpandedInComparison({
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
