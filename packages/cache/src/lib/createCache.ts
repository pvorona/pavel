import { RecordKey } from '@pavel/types'
import { getOrCreate } from './getOrCreate'

export type Cache<Key extends RecordKey, Value> = {
  get: (key: Key) => Value
}

// TODO
// - [ ] Allow to specify max size (LRU)
export function createCache<Key extends RecordKey, Value>(
  create: (key: Key) => Value,
): Cache<Key, Value> {
  const cache = {} as Record<Key, Value>

  return {
    get: (key: Key) => getOrCreate(cache, key, create),
  }
}
