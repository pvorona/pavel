export function swap<
  Key extends string | number | symbol,
  Value,
  T extends Record<Key, Value>,
>(source1: T, key1: Key, source2: T, key2: Key): void {
  const temp = source1[key1]
  source1[key1] = source2[key2]
  source2[key2] = temp
}
