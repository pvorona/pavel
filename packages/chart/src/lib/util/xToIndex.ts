import { interpolate } from '@pavel/utils'

export function xToIndex(xs: number[], x: number): number {
  const start = xs[0]

  if (x < start) {
    return 0
  }

  const end = xs[xs.length - 1]

  if (x > end) {
    return xs.length - 1
  }

  const approximateStartIndex = Math.floor(
    interpolate(start, end, 0, xs.length - 1, x),
  )
  const direction = xs[approximateStartIndex] < x ? 1 : -1

  for (
    let i = approximateStartIndex;
    i < xs.length - 1 && i >= 0;
    i += direction
  ) {
    if (x === xs[i]) {
      return i
    }

    if (x > xs[i] && x < xs[i + 1]) {
      return interpolate(xs[i], xs[i + 1], i, i + 1, x)
    }
  }

  return xs.length - 1
}
