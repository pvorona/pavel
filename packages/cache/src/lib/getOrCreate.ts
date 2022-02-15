import { RecordKey } from '@pavel/types'

export function getOrCreate<Key extends RecordKey, Value>(
  source: Record<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!(key in source)) {
    source[key] = createValue(createOrDefaultValue, key)
  }
  return source[key]
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
