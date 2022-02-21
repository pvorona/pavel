import { floor } from './math'

export function getClosestGreaterOrEqualDivisibleInt(
  n: number,
  divisor: number,
): number {
  const closestSmallerOrEqualDivisibleInt =
    getClosestSmallerOrEqualDivisibleInt(n, divisor)

  // Does not work with floats
  return floor(
    closestSmallerOrEqualDivisibleInt >= n
      ? closestSmallerOrEqualDivisibleInt
      : getClosestGreaterDivisibleInt(n, divisor),
  )
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
  return n + divisor - (n % divisor)
}
