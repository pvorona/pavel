export type ListNode<T> = {
  prev: ListNode<T> | null
  next: ListNode<T> | null
  value: T
}

export type List<T> = Iterable<T> &
  Readonly<{
    head: () => ListNode<T> | null
    tail: () => ListNode<T> | null
    pushNode: (node: ListNode<T>) => void
    push: (value: T) => ListNode<T>
    removeNode: (node: ListNode<T>) => void
    shift: () => ListNode<T>
    toArray: () => T[]
  }>
