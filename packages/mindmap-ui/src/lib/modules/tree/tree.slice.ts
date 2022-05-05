import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MindMapNode } from './tree.types'

export type TreeState = {
  root: MindMapNode | null
  text: string | null
  id: string | null
}

const INITIAL_STATE: TreeState = {
  root: null,
  id: null,
  text: null,
}

const treeSlice = createSlice({
  name: 'tree',
  initialState: INITIAL_STATE,
  reducers: {
    setTree: (state, { payload: tree }: PayloadAction<MindMapNode>) => {
      state.root = tree
    },
    setTreeId: (state, { payload: id }: PayloadAction<string>) => {
      state.id = id
    },
    setText: (state, { payload: text }: PayloadAction<string>) => {
      state.text = text
    },
  },
})

export const treeReducer = treeSlice.reducer

export const { setTree, setTreeId, setText } = treeSlice.actions
