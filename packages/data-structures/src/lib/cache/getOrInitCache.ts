import { RecordKey } from '@pavel/types'
import { createValue } from '@pavel/utils'
import { Cache } from './types'

export function getOrInitCache<Key extends RecordKey, Value>(
  source: Cache<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!source.has(key)) {
    source.set(key, createValue(createOrDefaultValue, key))
  }
  return source.get(key)
}
