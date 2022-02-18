export type ListNode<T> = {
  prev: ListNode<T> | null
  next: ListNode<T> | null
  value: T
}

export type List<T> = Readonly<{
  moveToTheEnd: (node: ListNode<T>) => void
  remove: (node: ListNode<T>) => void
  append: (node: ListNode<T>) => void
  getFirst: () => ListNode<T> | null
  getLast: () => ListNode<T> | null
  toJSON: () => string
}>

export const EMPTY_LIST_STRING = 'EMPTY_LIST'
export const TOKEN_SEPARATOR = ' -> '

export function createList<T>(): List<T> {
  let first: ListNode<T> | null = null
  let last: ListNode<T> | null = null

  function append(node: ListNode<T>) {
    if (first === null && last === null) {
      first = node
      last = node

      return
    }

    ;(last as ListNode<T>).next = node
    node.prev = last
    last = node
  }

  function moveToTheEnd(node: ListNode<T>) {
    remove(node)
    append(node)
  }

  function remove(node: ListNode<T>) {
    if (node.prev !== null) {
      node.prev.next = node.next
    }

    if (node.next !== null) {
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

    return tokens.join(TOKEN_SEPARATOR)
  }

  return {
    moveToTheEnd,
    remove,
    append,
    getFirst: () => first,
    getLast: () => last,
    toJSON,
  }
}

export function createNode<T>(value: T): ListNode<T> {
  return {
    prev: null,
    next: null,
    value,
  }
}
