import { createSlice } from '@pavel/redux-slice'

export type Size = {
  width: number
  height: number
}

export type ComparisonTableState = {
  optionIdToRemove: null | string
  optionSizeMap: Record<string, Size>
  tableSize: Size
  hover: {
    leftBlock: boolean
    rightBlock: boolean
  }
}

const comparisonTableSlice = createSlice({
  name: 'comparisonTable',
  initialState: {
    optionIdToRemove: null,
    optionSizeMap: {},
    tableSize: { width: 0, height: 0 },
    hover: {
      leftBlock: false,
      rightBlock: false,
    },
  } as ComparisonTableState,
  reducers: {
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
    setLeftBlockHovered: (state, hover: boolean) => {
      state.hover.leftBlock = hover
    },
    setRightBlockHovered: (state, hover: boolean) => {
      state.hover.rightBlock = hover
    },
  },
})

export const {
  setOptionIdToRemove,
  setOptionSize,
  setTableSize,
  setLeftBlockHovered,
  setRightBlockHovered,
} = comparisonTableSlice.actions
export const comparisonTableReducer = comparisonTableSlice.reducer
