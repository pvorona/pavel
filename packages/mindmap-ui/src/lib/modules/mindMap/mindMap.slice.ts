import { createSlice } from '@pavel/redux-slice'
import { ensureInBounds } from '@pavel/utils'
import { SCALE } from './mindMap.constants'

type MindMapState = {
  scale: number
  translateX: number
  translateY: number
  isSliderVisible: boolean
}

const INITIAL_STATE: MindMapState = {
  scale: SCALE.DEFAULT,
  translateX: 0,
  translateY: 0,
  isSliderVisible: false,
}

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState: INITIAL_STATE,
  reducers: {
    setScale: (state, scale: number) => {
      state.scale = ensureInBounds(scale, SCALE.MIN, SCALE.MAX)
    },
    setTranslateX: (state, translateX: number) => {
      state.translateX = translateX
    },
    shiftByX: (state, shiftX: number) => {
      state.translateX += shiftX / state.scale
    },
    shiftByY: (state, shiftY: number) => {
      state.translateY += shiftY / state.scale
    },
    setTranslateY: (state, translateY: number) => {
      state.translateY = translateY
    },
    setSliderVisible: (state, isVisible: boolean) => {
      state.isSliderVisible = isVisible
    },
  },
})

export const mindMapReducer = mindMapSlice.reducer

export const {
  setScale,
  setTranslateX,
  setTranslateY,
  setSliderVisible,
  shiftByX,
  shiftByY,
} = mindMapSlice.actions
