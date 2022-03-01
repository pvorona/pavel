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
          Price: '$600',
          Diagonal: "55''",
          Offer: 'PDF',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one takes a bit more space that I’d want.',
        },
      },
      'option 2': {
        id: 'option 2',
        name: 'Option 2',
        features: {
          Price: '$600',
          Diagonal: "65''",
          Offer: 'DOCX',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one fits pretty well with the rest of the room.',
        },
      },
      'option 3': {
        id: 'option 3',
        name: 'Option 3',
        features: {
          Price: '$6900',
          Diagonal: "165''",
          Offer: 'DOCX',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one fits pretty well with the rest of the room',
        },
      },
      'option 4': {
        id: 'option 4',
        name: 'Option 4',
        features: {
          Price: '$6900',
          Diagonal: "165''",
          Offer: 'DOCX',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one fits pretty well with the rest of the room',
        },
      },
      'option 5': {
        id: 'option 5',
        name: 'Option 5',
        features: {
          Price: '$6900',
          Diagonal: "165''",
          Offer: 'DOCX',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one fits pretty well with the rest of the room',
        },
      },
      'option 6': {
        id: 'option 6',
        name: 'Option 6',
        features: {
          Price: '$6900',
          Diagonal: "165''",
          Offer: 'DOCX',
          Contact: 'ted@google.com',
          Website: 'https://duckduckgo.com',
          Note: 'This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. This one fits pretty well with the rest of the room. ',
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
  },
})

export const { addOption } = optionsSlice.actions
