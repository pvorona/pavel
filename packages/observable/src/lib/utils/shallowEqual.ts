export function shallowEqual(
  a: { [key: string]: unknown },
  b: { [key: string]: unknown },
) {
  for (const key in a) {
    if (a[key] !== b[key]) return false
  }
  return true
}
