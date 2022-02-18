import { RecordKey } from '@pavel/types'
import { getOrInit } from '@pavel/utils'
import { Cached } from './types'

// TODO
// - [ ] Allow to specify max size (LRU/LRC)
export function makeCached<Key extends RecordKey, Value>(
  create: (key: Key) => Value,
): Cached<Key, Value> {
  const cache = {} as Record<Key, Value>

  return {
    get: (key: Key) => getOrInit(cache, key, create),
  }
}
