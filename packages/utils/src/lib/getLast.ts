import { assert } from '@pavel/assert'

export function getLast<T>(array: T[]): T {
  assert(array.length !== 0)

  return array[array.length - 1]
}
