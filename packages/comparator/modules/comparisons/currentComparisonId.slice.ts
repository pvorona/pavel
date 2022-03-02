import { createSlice } from '@pavel/redux-slice'
import { ComparisonsState } from '.'

export const currentComparisonIdSlice = createSlice({
  name: 'comparisons.currentComparisonId',
  initialState: 'comparison 1' as ComparisonsState['currentComparisonId'],
})
