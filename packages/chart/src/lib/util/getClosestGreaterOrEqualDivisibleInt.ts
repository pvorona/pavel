import { getNumberOfDecimalDigits, round } from '@pavel/utils'

export function getClosestGreaterOrEqualDivisibleInt(
  n: number,
  divisor: number,
): number {
  const numberOfDecimalDigits = getNumberOfDecimalDigits(n)
  const adjustedN = n * 10 ** numberOfDecimalDigits
  const adjustedDivisor = divisor * 10 ** numberOfDecimalDigits
  const closestSmallerOrEqualDivisibleInt =
    getClosestSmallerOrEqualDivisibleInt(adjustedN, adjustedDivisor)
  const magnifiedResult = (() => {
    if (closestSmallerOrEqualDivisibleInt === adjustedN) {
      return closestSmallerOrEqualDivisibleInt
    }

    return getClosestGreaterDivisibleInt(adjustedN, adjustedDivisor)
  })()

  return magnifiedResult / 10 ** numberOfDecimalDigits
}

export function getClosestSmallerOrEqualDivisibleInt(
  n: number,
  divisor: number,
): number {
  return n - (n % divisor)
}

export function getClosestGreaterDivisibleInt(
  n: number,
  divisor: number,
): number {
  return round(n + divisor - (n % divisor))
}
