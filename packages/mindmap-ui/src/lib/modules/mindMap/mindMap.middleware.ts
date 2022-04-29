import { Middleware } from 'redux'
import { HIDE_SLIDER_DELAY } from './mindMap.constants'
import { setScale, setSliderVisible } from './mindMap.slice'

let hideSliderTimeoutId: NodeJS.Timeout | undefined = undefined

export const mindMapMiddleware: Middleware = store => next => action => {
  next(action)

  if (action.type === setScale.toString()) {
    store.dispatch(setSliderVisible(true))

    if (hideSliderTimeoutId) {
      clearTimeout(hideSliderTimeoutId)
    }

    hideSliderTimeoutId = setTimeout(() => {
      store.dispatch(setSliderVisible(false))
    }, HIDE_SLIDER_DELAY)
  }
}
