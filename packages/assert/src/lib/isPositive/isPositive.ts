import { isNumber } from '../isNumber'

export function isPositive(n: unknown): boolean {
  return isNumber(n) && n > 0
}
