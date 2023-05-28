import { assert } from '../assert'
import { isDefined } from '../isDefined'

export function ensureDefined<T>(value: T | undefined): T {
  assert(isDefined(value), `Expected value ${value} to be defined`)

  return value
}
