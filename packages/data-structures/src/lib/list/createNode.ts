import { ListNode } from './types'

export function createNode<T>(value: T): ListNode<T> {
  return {
    prev: null,
    next: null,
    value,
  }
}
