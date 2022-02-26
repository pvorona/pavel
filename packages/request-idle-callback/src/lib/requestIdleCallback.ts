import { isBrowser, noop } from '@pavel/utils'

const supportsIdleCallback =
  isBrowser && window.requestIdleCallback !== undefined

function requestIdleCallbackFallback(fn: () => void) {
  return window.setTimeout(fn, 0)
}

export const requestIdleCallback = (() => {
  if (!isBrowser) {
    return noop
  }

  if (supportsIdleCallback) {
    return window.requestIdleCallback
  }

  return requestIdleCallbackFallback
})()

export const cancelIdleCallback = (() => {
  if (!isBrowser) {
    return noop
  }

  if (supportsIdleCallback) {
    return window.cancelIdleCallback
  }

  return window.clearInterval
})()
