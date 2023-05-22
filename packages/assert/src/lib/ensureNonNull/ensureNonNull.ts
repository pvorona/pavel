import { isNull } from 'lodash'
import { assert } from '../assert'

export function ensureNonNull<T>(value: T | null): T {
  assert(!isNull(value), `Expected value ${value} not to be null`)

  return value
}
