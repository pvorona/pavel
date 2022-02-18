export type ListNode<T> = {
  prev: ListNode<T> | null
  next: ListNode<T> | null
  value: T
}

export function createList<T>() {
  let first: ListNode<T> | null = null
  let last: ListNode<T> | null = null

  function append(node: ListNode<T>) {
    if (last) {
      last.next = node
    }

    node.prev = last
    last = node

    if (first === null) {
      first = node
    }
  }

  function moveToTheEnd(node: ListNode<T>) {
    // check first last
    remove(node)
    append(node)
  }

  function remove(node: ListNode<T>) {
    // Check if it's first or last
    if (node.prev) {
      node.prev.next = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    }

    if (node === first) {
      first = node.next
    }

    if (node === last) {
      last = node.prev
    }

    node.prev = null
    node.next = null
  }

  return {
    moveToTheEnd,
    remove,
    append,
    getFirst: () => first,
    getLast: () => last,
  }
}

export function createNode<T>(value: T): ListNode<T> {
  return {
    prev: null,
    next: null,
    value,
  }
}
