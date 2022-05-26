import { floor, ceil, interpolate } from '@pavel/utils'

export function interpolatePoint(
  index: number,
  values: readonly number[],
): number {
  return interpolate(
    floor(index),
    ceil(index),
    values[floor(index)],
    values[ceil(index)],
    index,
  )
}
