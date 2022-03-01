import { ensureGreaterThanOrEqual } from '../ensureGreaterThanOrEqual'
import { supportsIdleCallback } from './constants'

const MAX_RUNNING_TIME = 1_000 / 120

function createIdleDeadline(initialTime: DOMHighResTimeStamp): IdleDeadline {
  return {
    didTimeout: false,
    timeRemaining() {
      return ensureGreaterThanOrEqual(
        0,
        MAX_RUNNING_TIME - (performance.now() - initialTime),
      )
    },
  }
}

function requestIdleCallbackFallback(fn: IdleRequestCallback) {
  return setTimeout(() => fn(createIdleDeadline(performance.now())), 0)
}

export const requestIdleCallback = (() => {
  if (supportsIdleCallback) {
    return window.requestIdleCallback
  }

  return requestIdleCallbackFallback
})()

export const cancelIdleCallback = (() => {
  if (supportsIdleCallback) {
    return window.cancelIdleCallback
  }

  return clearInterval
})()
