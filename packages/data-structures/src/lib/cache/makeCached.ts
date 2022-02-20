import { RecordKey } from '@pavel/types'
import { createLRUCache } from './createLRUCache'
import { getOrInitCache } from './getOrInitCache'
import { Cached, CacheOptions } from './types'

export function makeCached<Key extends RecordKey, Value>(
  create: (key: Key) => Value,
  options: CacheOptions,
): Cached<Key, Value> {
  const cache = createLRUCache<Key, Value>(options)

  return {
    get: (key: Key) => getOrInitCache<Key, Value>(cache, key, create),
  }
}
