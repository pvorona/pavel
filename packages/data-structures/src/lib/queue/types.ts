import { ListNode } from '../list'

export type Queue<T> = {
  enqueue: (value: T) => void
  dequeue: () => T
  removeNode: (node: ListNode<T>) => void
}
