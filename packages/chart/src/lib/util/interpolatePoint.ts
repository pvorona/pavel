import { floor, ceil } from './math'
import { interpolate } from '@pavel/utils'

export function interpolatePoint(index: number, values: number[]): number {
  return interpolate(
    floor(index),
    ceil(index),
    values[floor(index)],
    values[ceil(index)],
    index,
  )
}
