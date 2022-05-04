import { createSlice } from '@pavel/redux-slice'
import { getQueryParam } from '@pavel/utils'
import { VIEW_MODE_QUERY_NAME } from './viewMode.constants'
import { ViewMode } from './viewMode.types'

const INITIAL_VIEW_MODE = (() => {
  const modes = getQueryParam(VIEW_MODE_QUERY_NAME)

  if (modes.length > 0) {
    const [mode] = modes

    if (mode === ViewMode.MARKDOWN) {
      return ViewMode.MARKDOWN
    }

    return ViewMode.MINDMAP
  }

  return ViewMode.MINDMAP
})()

const uiModeSlice = createSlice({
  name: 'viewMode',
  initialState: INITIAL_VIEW_MODE,
  reducers: {
    setViewMode: (_, mode: ViewMode) => {
      return mode
    },
  },
})

export const viewModeReducer = uiModeSlice.reducer

export const { setViewMode } = uiModeSlice.actions
