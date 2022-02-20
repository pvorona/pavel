import { ListNode } from './types'

export function createListNode<T>(value: T): ListNode<T> {
  return {
    prev: null,
    next: null,
    value,
  }
}
