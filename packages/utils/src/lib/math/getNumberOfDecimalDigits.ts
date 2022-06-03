import { isInteger } from './math'

export function getNumberOfDecimalDigits(n: number) {
  if (isInteger(n)) {
    return 0
  }

  return n.toString().split('.')[1].length
}
