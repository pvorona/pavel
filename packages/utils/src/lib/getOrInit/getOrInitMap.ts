import { createValue } from '../createValue'

export function getOrInitMap<Key, Value>(
  source: Map<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!source.has(key)) {
    source.set(key, createValue(createOrDefaultValue, key))
  }
  return source.get(key) as Value
}
