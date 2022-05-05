import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
    setScale: (state, { payload: scale }: PayloadAction<number>) => {
      state.scale = ensureInBounds(scale, SCALE.MIN, SCALE.MAX)
    },
    setTranslateX: (state, { payload: translateX }: PayloadAction<number>) => {
      state.translateX = translateX
    },
    shiftByX: (state, { payload: shiftX }: PayloadAction<number>) => {
      state.translateX += shiftX / state.scale
    },
    shiftByY: (state, { payload: shiftY }: PayloadAction<number>) => {
      state.translateY += shiftY / state.scale
    },
    setTranslateY: (state, { payload: translateY }: PayloadAction<number>) => {
      state.translateY = translateY
    },
    setSliderVisible: (
      state,
      { payload: isVisible }: PayloadAction<boolean>,
    ) => {
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
