import { assert, isInteger, isPositive } from '@pavel/assert'
import {
  createDoublyLinkedList,
  ListNode,
  createNode,
  moveToEnd,
} from '../list'
import { RecordKey } from '@pavel/types'
import { CacheOptions, Cache } from './types'

// const DEFAULT_OPTIONS: CacheOptions = {
// size: Infinity,
// updateRecencyOnHas: false,
// updateRecencyOnGet: false,
// }

export function createLRUCache<Key extends RecordKey, Value>(
  options: CacheOptions,
): Cache<Key, Value> {
  const { size } = options

  assert(
    isPositive(size) && isInteger(size),
    `Expected positive size, received ${size}`,
  )

  const keys = createDoublyLinkedList<Key>()
  const nodeByKey = new Map<Key, ListNode<Key>>()
  const valueByKey = new Map<Key, Value>()

  function get(key: Key) {
    assert(
      valueByKey.has(key),
      `Trying to get by non-existent key. Key: ${key}`,
    )

    const node = nodeByKey.get(key)
    moveToEnd(keys, node as ListNode<Key>)

    return valueByKey.get(key) as Value
  }

  function has(key: Key) {
    return valueByKey.has(key)
  }

  function set(key: Key, value: Value) {
    if (valueByKey.has(key)) {
      valueByKey.set(key, value)

      const node = nodeByKey.get(key)

      moveToEnd(keys, node as ListNode<Key>)

      return
    }

    if (valueByKey.size === size) {
      const first = keys.first() as ListNode<Key>
      const { value: removedKey } = first

      keys.removeNode(first)
      valueByKey.delete(removedKey as Key)
      nodeByKey.delete(removedKey)
    }

    valueByKey.set(key, value)
    const node = keys.push(key)
    nodeByKey.set(key, node)
  }

  return { get, set, has }
}
