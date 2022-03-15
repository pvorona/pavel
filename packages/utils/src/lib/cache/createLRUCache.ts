import { assert, isInteger, isPositive } from '@pavel/assert'
import {
  createDoublyLinkedList,
  ListNode,
  moveToEnd,
} from '../DoublyLinkedList'
import { RecordKey } from '@pavel/types'
import { CacheOptions, Cache } from './types'
import { createLinkedList } from '../LinkedList'

type CacheNode<Key, Value> = {
  key: Key
  value: Value
}

export function createLRUCache<Key extends RecordKey, Value>(
  options: CacheOptions,
): Cache<Key, Value> {
  const { max } = options

  assert(
    isPositive(max) && isInteger(max),
    `Expected positive integer, received: ${max}`,
  )

  const nodes = createLinkedList<CacheNode<Key, Value>>()
  const nodeByKey = new Map<Key, ListNode<CacheNode<Key, Value>>>()

  function get(key: Key) {
    assert(nodeByKey.has(key), `Trying to get by non-existent key: ${key}`)

    updateRecency(key)

    return (nodeByKey.get(key) as ListNode<CacheNode<Key, Value>>).value.value
  }

  function has(key: Key) {
    return nodeByKey.has(key)
  }

  function set(key: Key, value: Value) {
    if (nodeByKey.has(key)) {
      const node = nodeByKey.get(key)
      nodes.removeNode(node as ListNode<CacheNode<Key, Value>>)
      nodeByKey.delete(key)
    } else if (nodeByKey.size === max) {
      const { key: keyToRemove } = nodes.shift()

      nodeByKey.delete(keyToRemove)
    }

    const node = nodes.append({ key, value })

    nodeByKey.set(key, node)
  }

  function updateRecency(key: Key) {
    const node = nodeByKey.get(key)

    moveToEnd(nodes, node as ListNode<CacheNode<Key, Value>>)
  }

  return { get, set, has }
}
