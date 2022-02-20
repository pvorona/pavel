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
  if (!has(source, key)) {
    set(source, key, createValue(createOrDefaultValue, key))
  }
  return get(source, key)
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

function has<Key extends RecordKey, Value>(
  source: MapLike<Key, Value> | Record<Key, Value>,
  key: Key,
) {
  return 'has' in source ? source.has(key) : key in source
}

function set<Key extends RecordKey, Value>(
  source: MapLike<Key, Value> | Record<Key, Value>,
  key: Key,
  value: Value,
) {
  return 'set' in source ? source.set(key, value) : (source[key] = value)
}

function get<Key extends RecordKey, Value>(
  source: MapLike<Key, Value> | Record<Key, Value>,
  key: Key,
) {
  return 'get' in source ? source.get(key) : source[key]
}
