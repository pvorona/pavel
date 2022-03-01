export function removeAt<T>(array: T[], index: number): T[] {
  array.splice(index, 1)

  return array
}
