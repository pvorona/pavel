const supportsIdleCallback = window.requestIdleCallback !== undefined

function requestIdleCallbackFallback(fn: () => void) {
  return window.setTimeout(fn, 0)
}

export const requestIdleCallback = supportsIdleCallback
  ? window.requestIdleCallback
  : requestIdleCallbackFallback

export const cancelIdleCallback = supportsIdleCallback
  ? window.cancelIdleCallback
  : window.clearInterval
