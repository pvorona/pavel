import { assert } from '../assert'
import { isDefined } from '../isDefined'

export function ensureDefined<T>(
  value: T | undefined,
  message = `Expected value ${value} to be defined`,
): T {
  assert(isDefined(value), message)

  return value
}
