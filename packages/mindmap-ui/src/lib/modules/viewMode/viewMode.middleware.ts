import { Middleware } from 'redux'
import Router from 'next/router'
import { VIEW_MODE_QUERY_NAME } from './viewMode.constants'
import { setViewMode } from './viewMode.slice'
import { getQueryParam } from '@pavel/utils'
import { ViewMode } from './viewMode.types'

export const viewModeMiddleware: Middleware = ({ dispatch }) => {
  // Update store state when using back button
  // Router.events.on(
  //   'beforeHistoryChange',
  //   (path: string, { shallow }: { shallow: boolean }) => {
  //     if (shallow) {
  //       return
  //     }

  //     const modes = getQueryParam(VIEW_MODE_QUERY_PARAM_NAME, path)

  //     // if (modes.length === 1 && modes[0] !== viewMode) {
  //     if (modes.length === 1) {
  //       const mode =
  //         modes[0] === ViewMode.MINDMAP ? ViewMode.MINDMAP : ViewMode.MARKDOWN
  //       console.log('route change effect')
  //       dispatch(setViewMode(mode))
  //     }
  //   },
  // )

  return next => action => {
    if (action.type === setViewMode.toString()) {
      const url = new URL(window.location.href)
      url.searchParams.set(VIEW_MODE_QUERY_NAME, action.payload)
      Router.replace(url, undefined)
    }

    return next(action)
  }
}
