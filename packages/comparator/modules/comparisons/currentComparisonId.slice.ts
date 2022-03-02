import { createSlice } from '@pavel/redux-slice'
import { ComparisonsState } from '.'

export const currentComparisonIdSlice = createSlice({
  name: 'comparisons.currentComparisonId',
  initialState: null as ComparisonsState['currentComparisonId'],
  handlers: {
    setCurrentComparisonId: (_, id: string) => id,
  },
})

export const { setCurrentComparisonId } = currentComparisonIdSlice.actions
