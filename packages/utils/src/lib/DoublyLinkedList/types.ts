export type LinkedListNode<T> = {
  next: LinkedListNode<T> | null
  value: T
}

// export type DoublyLinkedListNode<T> = {
export type ListNode<T> = {
  prev: ListNode<T> | null
  next: ListNode<T> | null
  value: T
}

export type List<T> = Iterable<T> &
  Readonly<{
    head: ListNode<T> | null
    tail: ListNode<T> | null
    size: number
    isEmpty: boolean
    appendNode: (node: ListNode<T>) => void
    prependNode: (node: ListNode<T>) => void
    append: (value: T) => ListNode<T>
    prepend: (value: T) => ListNode<T>
    removeNode: (node: ListNode<T>) => void
    shift: () => T
    pop: () => T
    toArray: () => T[]
  }>
