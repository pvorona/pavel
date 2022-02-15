import {
  requestIdleCallback,
  cancelIdleCallback,
} from '@pavel/requestIdleCallback'

export type IdleValue<T> = {
  get: () => T
}

export function idleValue<T>(compute: () => T): IdleValue<T> {
  const idleCallbackId = requestIdleCallback(computeValue)

  let value: T
  let hasComputed = false

  function computeValue() {
    value = compute()
    hasComputed = true
  }

  function get() {
    if (!hasComputed) {
      cancelIdleCallback(idleCallbackId)
      computeValue()
    }

    return value
  }

  return {
    get,
  }
}
