import { RecordKey } from '@pavel/types'
import { getOrInitV2 } from '@pavel/utils'
import { createLRUCache } from './createLRUCache'
import { Cached, CacheOptions } from './types'

// TODO
// - [ ] Allow to specify max size (LRU/LRC)
export function makeCached<Key extends RecordKey, Value>(
  create: (key: Key) => Value,
  options: CacheOptions,
): Cached<Key, Value> {
  // const cache = {} as Record<Key, Value>
  const cache = createLRUCache<Key, Value>(options)

  return {
    get: (key: Key) => getOrInitV2<Key, Value>(cache, key, create),
  }
}
