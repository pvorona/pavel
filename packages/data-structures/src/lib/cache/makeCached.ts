import { RecordKey } from '@pavel/types'
import { getOrInitV2 } from '@pavel/utils'
import { createLRUCache } from './createLRUCache'
import { Cached, CacheOptions } from './types'

export function makeCached<Key extends RecordKey, Value>(
  create: (key: Key) => Value,
  options: CacheOptions,
): Cached<Key, Value> {
  const cache = createLRUCache<Key, Value>(options)

  return {
    get: (key: Key) => getOrInitV2<Key, Value>(cache, key, create),
  }
}
