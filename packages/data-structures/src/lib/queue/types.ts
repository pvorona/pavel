import { ListNode } from '../list'

export type Queue<T> = Iterable<T> & {
  enqueue: (value: T) => ListNode<T>
  dequeue: () => T
  removeNode: (node: ListNode<T>) => void
  isEmpty: boolean
  size: number
}
