import { assert } from '@pavel/assert'
import { createList, ListNode, createNode } from '../list'
import { RecordKey } from '@pavel/types'
import { CacheOptions, Cache } from './types'

const DEFAULT_OPTIONS: CacheOptions = {
  size: Infinity,
}

export function createLRUCache<Key extends RecordKey, Value>(
  options: CacheOptions,
): Cache<Key, Value> {
  const { size } = { ...DEFAULT_OPTIONS, ...options }

  assert(size > 0, `Expected positive cache size, received ${size}`)

  const keys = createList<Key>()
  const nodeByKey = new Map<Key, ListNode<Key>>()
  const valueByKey = new Map<Key, Value>()

  function get(key: Key) {
    assert(
      valueByKey.has(key),
      `Trying to get by non-existent key. Key: ${key}`,
    )

    return valueByKey.get(key) as Value
  }

  function has(key: Key) {
    return valueByKey.has(key)
  }

  function set(key: Key, value: Value) {
    if (valueByKey.has(key)) {
      valueByKey.set(key, value)

      const node = nodeByKey.get(key)

      keys.moveToTheEnd(node as ListNode<Key>)

      return
    }

    if (valueByKey.size === size) {
      const first = keys.getFirst() as ListNode<Key>
      const { value: removedKey } = first

      keys.remove(first)
      valueByKey.delete(removedKey as Key)
      nodeByKey.delete(removedKey)
    }

    valueByKey.set(key, value)
    const node = createNode(key)
    nodeByKey.set(key, node)
    keys.append(node)
  }

  return { get, set, has }
}
