import { createNode } from './createNode'
import { List, ListNode } from './types'

export const EMPTY_LIST_STRING = 'EMPTY_LIST'
export const VALUE_SEPARATOR = ' <-> '

export function createDoublyLinkedList<T>(): List<T> {
  let first: ListNode<T> | null = null
  let last: ListNode<T> | null = null

  function push(value: T) {
    const node = createNode(value)

    pushNode(node)

    return node
  }

  function pushNode(node: ListNode<T>) {
    if (first === null && last === null) {
      first = node
      last = node

      return
    }

    ;(last as ListNode<T>).next = node
    node.prev = last
    last = node
  }

  function removeNode(node: ListNode<T>) {
    const { next, prev } = node

    if (prev !== null) {
      prev.next = next
    }

    if (next !== null) {
      next.prev = prev
    }

    if (node === first) {
      first = next
    }

    if (node === last) {
      last = prev
    }

    node.prev = null
    node.next = null
  }

  function toJSON() {
    if (first === null) {
      return EMPTY_LIST_STRING
    }

    const tokens = []
    let current: null | ListNode<T> = first

    while (current) {
      tokens.push(current.value)
      current = current.next
    }

    return tokens.join(VALUE_SEPARATOR)
  }

  return {
    removeNode,
    pushNode,
    push,
    first: () => first,
    last: () => last,
    toJSON,
  }
}
