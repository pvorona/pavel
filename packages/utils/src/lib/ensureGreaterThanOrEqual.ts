export function ensureGreaterThanOrEqual(min: number, value: number): number {
  if (value < min) return min

  return value
}
