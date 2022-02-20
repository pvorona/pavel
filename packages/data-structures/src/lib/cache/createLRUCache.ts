import { assert, isInteger, isPositive } from '@pavel/assert'
import { createDoublyLinkedList, ListNode, moveToEnd } from '../list'
import { RecordKey } from '@pavel/types'
import { CacheOptions, Cache } from './types'

// const DEFAULT_OPTIONS: CacheOptions = {
// size: Infinity,
// updateRecencyOnHas: false,
// updateRecencyOnGet: false,
// }

type CacheNode<Key, Value> = {
  key: Key
  value: Value
  // left: CacheNode<Key, Value> | null
  // right: CacheNode<Key, Value> | null
}

export function createLRUCache<Key extends RecordKey, Value>(
  options: CacheOptions,
): Cache<Key, Value> {
  const { max } = options

  assert(
    isPositive(max) && isInteger(max),
    `Expected positive integer, received: ${max}`,
  )

  // const keys = createDoublyLinkedList<Key>()
  const nodes = createDoublyLinkedList<CacheNode<Key, Value>>()
  const nodeByKey = new Map<Key, ListNode<CacheNode<Key, Value>>>()
  // const valueByKey = new Map<Key, Value>()

  function get(key: Key) {
    // assert(valueByKey.has(key), `Trying to get by non-existent key: ${key}`)
    assert(nodeByKey.has(key), `Trying to get by non-existent key: ${key}`)

    updateRecency(key)

    // return valueByKey.get(key) as Value
    return (nodeByKey.get(key) as ListNode<CacheNode<Key, Value>>).value.value
  }

  function has(key: Key) {
    // return valueByKey.has(key)
    return nodeByKey.has(key)
  }

  function set(key: Key, value: Value) {
    // if (valueByKey.has(key)) {
    if (nodeByKey.has(key)) {
      // valueByKey.set(key, value)
      // // const node = nodeByKey.get(key) as ListNode<CacheNode<Key,Value>>
      // // nodeByKey.set(key, { ...node,value:{key, value} })

      // // updateRecency(key)
      const node = nodeByKey.get(key)
      nodes.removeNode(node as ListNode<CacheNode<Key, Value>>)
      nodeByKey.delete(key)

      // return
    }

    // if (valueByKey.size === size) {
    else if (nodeByKey.size === max) {
      // const { value: removedKey } = keys.shift()
      const {
        value: { key: keyToRemove },
      } = nodes.shift()

      // valueByKey.delete(removedKey as Key)
      nodeByKey.delete(keyToRemove)
    }

    // const node = keys.push(key)
    const node = nodes.push({ key, value })

    // nodeByKey.set(key, node)
    nodeByKey.set(key, node)
    // valueByKey.set(key, value)
  }

  function updateRecency(key: Key) {
    const node = nodeByKey.get(key)

    // moveToEnd(keys, node as ListNode<Key>)
    moveToEnd(nodes, node as ListNode<CacheNode<Key, Value>>)
  }

  return { get, set, has }
}
