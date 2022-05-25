import { abs, max, min } from './math'
import { Rect } from './types'

export function toCanonicalRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Rect {
  return {
    x: min(x1, x2),
    y: max(y1, y2),
    width: abs(x1 - x2),
    height: abs(y1 - y2),
  }
}
