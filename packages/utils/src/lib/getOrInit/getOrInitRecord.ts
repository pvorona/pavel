import { RecordKey } from '@pavel/types'
import { createValue } from '../createValue'

export function getOrInitRecord<Key extends RecordKey, Value>(
  source: Record<Key, Value>,
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!(key in source)) {
    source[key] = createValue(createOrDefaultValue, key)
  }
  return source[key]
}
