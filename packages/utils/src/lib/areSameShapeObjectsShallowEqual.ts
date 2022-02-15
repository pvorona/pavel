export function areSameShapeObjectsShallowEqual<
  T extends Record<string | number | symbol, unknown>,
>(a: T, b: T) {
  for (const key in a) {
    if (a[key] !== b[key]) return false
  }
  return true
}
