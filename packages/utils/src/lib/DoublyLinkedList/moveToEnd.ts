import { List, ListNode } from './types'

export function moveToEnd<T>(list: List<T>, node: ListNode<T>) {
  list.removeNode(node)
  list.appendNode(node)
}
