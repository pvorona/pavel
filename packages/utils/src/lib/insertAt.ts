export function insertAt<T>(array: T[], index: number, item: T): T[] {
  array.splice(index, 0, item)

  return array
}
