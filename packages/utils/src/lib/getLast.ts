export function getLast<T>(array: T[]): T | undefined {
  return array.length === 0 ? undefined : array[array.length - 1]
}
