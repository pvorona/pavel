import { assert } from '@pavel/assert'
import { createListNode } from './createListNode'
import { List, ListNode } from './types'

export function DoublyLinkedList<T>(): List<T> {
  let head: ListNode<T> | null = null
  let tail: ListNode<T> | null = null

  function push(value: T) {
    const node = createListNode(value)

    pushNode(node)

    return node
  }

  function pushNode(node: ListNode<T>) {
    if (head === null && tail === null) {
      head = node
      tail = node

      return
    }

    ;(tail as ListNode<T>).next = node
    node.prev = tail
    tail = node
  }

  function shift() {
    assert(head !== null, 'Cannot shift empty list')

    const node = head

    removeNode(node as ListNode<T>)

    return (node as ListNode<T>).value
  }

  function removeNode(node: ListNode<T>) {
    const { next, prev } = node

    if (prev !== null) {
      prev.next = next
    }

    if (next !== null) {
      next.prev = prev
    }

    if (node === head) {
      head = next
    }

    if (node === tail) {
      tail = prev
    }

    node.prev = null
    node.next = null
  }

  function toArray() {
    return [...iterate()]
  }

  function* iterate() {
    let current: null | ListNode<T> = head

    while (current) {
      yield current.value
      current = current.next
    }
  }

  return {
    removeNode,
    pushNode,
    push,
    shift,
    head: () => head,
    tail: () => tail,
    [Symbol.iterator]: iterate,
    toArray,
  }
}
