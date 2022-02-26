import { createQueue } from './Queue'

describe('Queue', () => {
  it('throws when calling dequeue on empty queue', () => {
    const queue = createQueue()

    expect(() => queue.dequeue()).toThrow('Cannot shift empty list')
  })

  it('adds and removes items', () => {
    const queue = createQueue()

    queue.enqueue(1)

    expect(queue.dequeue()).toBe(1)

    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)

    expect(queue.dequeue()).toBe(1)
    expect(queue.dequeue()).toBe(2)
    expect(queue.dequeue()).toBe(3)
  })
})
