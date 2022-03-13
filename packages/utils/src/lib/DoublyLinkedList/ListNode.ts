import { ListNode } from './types'

// head
// tail
// middle
// detached
export function createListNode<T>(value: T): ListNode<T> {
  return {
    prev: null,
    next: null,
    value,
  }
}
