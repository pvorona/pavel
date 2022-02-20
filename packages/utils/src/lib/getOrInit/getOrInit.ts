import { RecordKey } from '@pavel/types'

export function getOrInit<Key extends RecordKey, Value>(
  source: Record<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!(key in source)) {
    source[key] = createValue(createOrDefaultValue, key)
  }
  return source[key]
}

type MapLike<K, V> = {
  has: (k: K) => boolean
  get: (k: K) => V
  set: (k: K, v: V) => void
}

export function getOrInitV2<Key extends RecordKey, Value>(
  source: MapLike<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!source.has(key)) {
    source.set(key, createValue(createOrDefaultValue, key))
  }
  return source.get(key)
}

function createValue<Key extends RecordKey, Value>(
  createOrDefaultValue: ((key: Key) => Value) | Value,
  key: Key,
): Value {
  if (createOrDefaultValue instanceof Function) {
    return createOrDefaultValue(key)
  }

  return createOrDefaultValue
}
