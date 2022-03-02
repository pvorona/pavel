import { createSlice } from '@pavel/redux-slice'
import { OptionsState, Option } from './types'

export const optionsByIdSlice = createSlice({
  name: 'options.byId',
  initialState: {} as OptionsState['byId'],
  handlers: {
    addOption: (state, option: Option) => ({
      ...state,
      [option.id]: option,
    }),

    setOptionFeatureValue: (
      state,
      {
        optionId,
        featureId,
        value,
      }: { optionId: string; featureId: string; value: string },
    ) => {
      const option = state[optionId]
      const features = {
        ...option.features,
        [featureId]: value,
      }

      return {
        ...state,
        [optionId]: {
          ...option,
          features,
        },
      }
    },

    setOptionProperty: (
      state,
      { id, ...change }: Partial<Option> & { id: string },
    ) => ({
      ...state,
      [id]: {
        ...state[id],
        ...change,
      },
    }),
  },
})

export const { addOption, setOptionFeatureValue, setOptionProperty } =
  optionsByIdSlice.actions
