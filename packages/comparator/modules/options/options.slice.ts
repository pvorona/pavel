import { createSlice } from '@pavel/redux-slice'
import { OptionsState, Option } from './types'

export const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    byId: {
      'option 1': {
        id: 'option 1',
        name: 'Option 1',
        features: {
          'feature 1': '$600',
          'feature 2': "55''",
          'feature 3': 'PDF',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6': 'This one takes a bit more space that I’d want.',
        },
      },
      'option 2': {
        id: 'option 2',
        name: 'Option 2',
        features: {
          'feature 1': '$600',
          'feature 2': "65''",
          'feature 3': 'DOCX',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6': 'This one fits pretty well with the rest of the room.',
        },
      },
      'option 3': {
        id: 'option 3',
        name: 'Option 3',
        features: {
          'feature 1': '$6900',
          'feature 2': "165''",
          'feature 3': 'DOCX',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6': 'This one fits pretty well with the rest of the room',
        },
      },
      'option 4': {
        id: 'option 4',
        name: 'Option 4',
        features: {
          'feature 1': '$6900',
          'feature 2': "165''",
          'feature 3': 'DOCX',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6': 'This one fits pretty well with the rest of the room',
        },
      },
      'option 5': {
        id: 'option 5',
        name: 'Option 5',
        features: {
          'feature 1': '$6900',
          'feature 2': "165''",
          'feature 3': 'DOCX',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6': 'This one fits pretty well with the rest of the room',
        },
      },
      'option 6': {
        id: 'option 6',
        name: 'Option 6',
        features: {
          'feature 1': '$6900',
          'feature 2': "165''",
          'feature 3': 'DOCX',
          'feature 4': 'ted@google.com',
          'feature 5': 'https://duckduckgo.com',
          'feature 6':
            'This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. ',
        },
      },
    },
  } as OptionsState,
  handlers: {
    addOption: (state, option: Option) => ({
      ...state,
      byId: {
        ...state.byId,
        [option.id]: option,
      },
    }),
    setOptionFeatureValue: (
      state,
      {
        optionId,
        featureId,
        value,
      }: { optionId: string; featureId: string; value: string },
    ) => {
      const option = state.byId[optionId]
      const features = {
        ...option.features,
        [featureId]: value,
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          [optionId]: {
            ...option,
            features,
          },
        },
      }
    },
    setOptionProperty: (
      state,
      { id, ...change }: Partial<Option> & { id: string },
    ) => ({
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          ...state.byId[id],
          ...change,
        },
      },
    }),
  },
})

export const { addOption, setOptionFeatureValue, setOptionProperty } =
  optionsSlice.actions
