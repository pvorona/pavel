export function findMinIndex(array: number[]): number {
  let minIndex = 0
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[minIndex]) minIndex = i
  }
  return minIndex
}
