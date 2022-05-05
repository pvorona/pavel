import { createSlice } from '@pavel/redux-slice'
import { OptionsState } from './types'
import { Option } from '@pavel/comparator-shared'

export const optionsByIdSlice = createSlice({
  name: 'options.byId',
  initialState: {} as OptionsState['byId'],
  reducers: {
    addOption: (state, option: Option) => {
      state[option.id] = option
    },

    setOptionFeatureValue: (
      state,
      {
        optionId,
        featureId,
        value,
      }: { optionId: string; featureId: string; value: string },
    ) => {
      state[optionId].features[featureId] = value
    },

    setOptionProperty: (
      state,
      { id, ...change }: Partial<Option> & { id: string },
    ) => {
      Object.assign(state[id], change)
    },
  },
})

export const { addOption, setOptionFeatureValue, setOptionProperty } =
  optionsByIdSlice.actions
