import { createSlice } from '@pavel/redux-slice'
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
    setTree: (state, tree: MindMapNode) => {
      state.root = tree
    },
    setTreeId: (state, id: string) => {
      state.id = id
    },
    setText: (state, text: string) => {
      state.text = text
    },
  },
})

export const treeReducer = treeSlice.reducer

export const { setTree, setTreeId, setText } = treeSlice.actions
