import { isUndefined } from '../isUndefined'

export function isDefined<T>(value: T | undefined): value is T {
  return !isUndefined(value)
}
