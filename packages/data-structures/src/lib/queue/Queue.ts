import { createDoublyLinkedList, ListNode } from '../list'
import { Queue } from './types'

export function createQueue<T>(): Queue<T> {
  const container = createDoublyLinkedList<T>()

  function enqueue(value: T) {
    container.append(value)
  }

  function dequeue() {
    return container.shift()
  }

  function removeNode(node: ListNode<T>) {
    container.removeNode(node)
  }

  return {
    enqueue,
    dequeue,
    removeNode,
  }
}
