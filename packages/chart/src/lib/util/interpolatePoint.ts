import { floor, ceil } from './math'
import { interpolate } from '@pavel/utils'

// Only works with evenly-spaced series
export function interpolatePoint(point: number, values: number[]): number {
  return interpolate(
    floor(point),
    ceil(point),
    values[floor(point)],
    values[ceil(point)],
    point,
  )
}
