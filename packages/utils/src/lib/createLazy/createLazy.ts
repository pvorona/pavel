import { Getter, Lambda } from '@pavel/types'

export type Lazy<T> = {
  readonly get: Getter<T>
  readonly notifyChanged: Lambda
}

export function createLazy<T>(compute: Getter<T>): Lazy<T> {
  let value: T
  let mustCompute = true

  function get() {
    if (mustCompute) {
      mustCompute = false
      value = compute()
    }

    return value
  }

  function notifyChanged() {
    mustCompute = true
  }

  return { get, notifyChanged }
}
