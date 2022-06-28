import { assert, isPositive } from '@pavel/assert'

export function getSimpleMovingAverage(
  values: number[],
  windowSize = 31,
): number[] {
  assert(isPositive(windowSize))
  assert(windowSize <= values.length)

  const result = []

  let windowSum = 0

  for (let i = 0; i < windowSize - 1; i++) {
    windowSum += values[i]
    result.push(0)
  }

  windowSum += values[windowSize - 1]
  result.push(windowSum / windowSize)

  for (let i = windowSize; i < values.length; i++) {
    windowSum = windowSum + values[i] - values[i - windowSize]

    result.push(windowSum / windowSize)
  }

  return result
}
