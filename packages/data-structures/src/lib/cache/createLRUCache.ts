import { assert, isInteger, isPositive } from '@pavel/assert'
import { createDoublyLinkedList, ListNode, moveToEnd } from '../list'
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
    `Expected positive integer, received: ${size}`,
  )

  const keys = createDoublyLinkedList<Key>()
  const nodeByKey = new Map<Key, ListNode<Key>>()
  const valueByKey = new Map<Key, Value>()

  function get(key: Key) {
    assert(valueByKey.has(key), `Trying to get by non-existent key: ${key}`)

    updateRecency(key)

    return valueByKey.get(key) as Value
  }

  function has(key: Key) {
    return valueByKey.has(key)
  }

  function set(key: Key, value: Value) {
    if (valueByKey.has(key)) {
      valueByKey.set(key, value)

      updateRecency(key)

      return
    }

    if (valueByKey.size === size) {
      const { value: removedKey } = keys.shift()

      valueByKey.delete(removedKey as Key)
      nodeByKey.delete(removedKey)
    }

    const node = keys.push(key)

    nodeByKey.set(key, node)
    valueByKey.set(key, value)
  }

  function updateRecency(key: Key) {
    const node = nodeByKey.get(key)

    moveToEnd(keys, node as ListNode<Key>)
  }

  return { get, set, has }
}
