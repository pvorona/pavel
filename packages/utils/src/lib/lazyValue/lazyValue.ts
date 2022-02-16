import { Lambda } from '@pavel/types'

export type LazyValue<T> = {
  get: () => T
  notifyChanged: Lambda
}

export function lazyValue<T>(compute: () => T): LazyValue<T> {
  let value: undefined | T
  let shouldCompute = true

  function get() {
    if (shouldCompute) {
      shouldCompute = false
      value = compute()
    }

    return value as T
  }

  function notifyChanged() {
    shouldCompute = true
  }

  return { get, notifyChanged }
}
