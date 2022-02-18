export type ListNode<T> = {
  prev: ListNode<T> | null
  next: ListNode<T> | null
  value: T
}

export type List<T> = Readonly<{
  first: () => ListNode<T> | null
  last: () => ListNode<T> | null
  pushNode: (node: ListNode<T>) => void
  push: (value: T) => ListNode<T>
  removeNode: (node: ListNode<T>) => void
  shift: () => ListNode<T>
  toJSON: () => string
}>
