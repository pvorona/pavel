import { createDoublyLinkedList, ListNode } from '../list'
import { Queue } from './types'

export function createQueue<T>(): Queue<T> {
  const container = createDoublyLinkedList<T>()

  function enqueue(value: T) {
    return container.append(value)
  }

  function dequeue() {
    return container.shift()
  }

  function removeNode(node: ListNode<T>) {
    container.removeNode(node)
  }

  function* iterate() {
    while (!container.isEmpty) {
      yield container.shift()
    }
  }

  return {
    enqueue,
    dequeue,
    removeNode,
    get isEmpty() {
      return container.isEmpty
    },
    [Symbol.iterator]: iterate,
  }
}
