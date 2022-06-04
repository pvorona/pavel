export function getByRingIndex<T>(values: readonly T[], index: number): T {
  return values[index % values.length]
}
