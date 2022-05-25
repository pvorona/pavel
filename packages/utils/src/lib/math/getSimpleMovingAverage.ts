import { floor } from './math'

export function getSimpleMovingAverage(
  values: number[],
  windowSize = 31,
): number[] {
  const result = []

  for (let i = 0; i < values.length; i++) {
    if (
      i < floor(windowSize / 2) ||
      i > values.length - 1 - floor(windowSize / 2)
    ) {
      result.push(0)

      continue
    }

    let sum = 0

    // TODO: optimize
    for (
      let j = i - floor(windowSize / 2);
      j <= i + floor(windowSize / 2);
      j++
    ) {
      sum += values[j]
    }

    result.push(sum / windowSize)
  }

  return result
}
