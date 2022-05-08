import { Middleware } from 'redux'
import { VIEW_MODE_QUERY_NAME } from './viewMode.constants'
import { setViewMode } from './viewMode.slice'

export const viewModeMiddleware: Middleware = ({ dispatch }) => {
  return next => action => {
    if (action.type === setViewMode.toString()) {
      const url = new URL(window.location.href)
      url.searchParams.set(VIEW_MODE_QUERY_NAME, action.payload)
      window.history.replaceState(null, '', url)
    }

    return next(action)
  }
}
