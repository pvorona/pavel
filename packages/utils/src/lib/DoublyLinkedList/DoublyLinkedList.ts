import { assert } from '@pavel/assert'
import { createListNode } from './ListNode'
import { List, ListNode } from './types'

export function createDoublyLinkedList<T>(): List<T> {
  let head: ListNode<T> | null = null
  let tail: ListNode<T> | null = null
  let size = 0

  function prepend(value: T) {
    const node = createListNode(value)

    prependNode(node)

    return node
  }

  function append(value: T) {
    const node = createListNode(value)

    appendNode(node)

    return node
  }

  function prependNode(node: ListNode<T>) {
    size++

    if (head === null && tail === null) {
      head = node
      tail = node

      return
    }

    ;(head as ListNode<T>).prev = node
    node.next = head
    head = node
  }

  function appendNode(node: ListNode<T>) {
    size++

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

  function pop() {
    assert(tail !== null, 'Cannot pop empty list')

    const node = tail

    removeNode(node as ListNode<T>)

    return (node as ListNode<T>).value
  }

  function removeNode(node: ListNode<T>) {
    const { next, prev } = node

    if (prev === null && next === null && head !== node && tail !== node) {
      // node is detached
      return
    }

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

    size--
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
    prepend,
    append,
    prependNode,
    appendNode,
    shift,
    pop,
    get head() {
      return head
    },
    get tail() {
      return tail
    },
    get size() {
      return size
    },
    get isEmpty() {
      return size === 0
    },
    [Symbol.iterator]: iterate,
    toArray,
  }
}
