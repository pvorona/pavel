import { createSlice } from '@pavel/redux-slice'

export type Size = {
  width: number
  height: number
}

export type ComparisonTableState = {
  optionIdToRemove: null | string
  optionSizeMap: Record<string, Size>
  tableSize: Size
}

const comparisonTableSlice = createSlice({
  name: 'comparisonTable',
  initialState: {
    optionIdToRemove: null,
    optionSizeMap: {},
    tableSize: { width: 0, height: 0 },
  } as ComparisonTableState,
  handlers: {
    setOptionIdToRemove: (state, optionId: string) => {
      state.optionIdToRemove = optionId
    },
    setOptionSize: (
      state,
      { optionId, size }: { optionId: string; size: Size },
    ) => {
      state.optionSizeMap[optionId] = size
    },
    setTableSize: (state, size: Size) => {
      state.tableSize = size
    },
  },
})

export const { setOptionIdToRemove, setOptionSize, setTableSize } =
  comparisonTableSlice.actions
export const comparisonTableReducer = comparisonTableSlice.reducer
