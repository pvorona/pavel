import { createQueue } from './Queue'

describe('Queue', () => {
  it('throws when calling dequeue on empty queue', () => {
    const queue = createQueue()

    expect(queue.isEmpty).toBe(true)
    expect(() => queue.dequeue()).toThrow('Cannot shift empty list')
  })

  it('adds and removes items', () => {
    const queue = createQueue()

    queue.enqueue(1)

    expect(queue.isEmpty).toBe(false)
    expect(queue.dequeue()).toBe(1)
    expect(queue.isEmpty).toBe(true)

    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)

    expect(queue.isEmpty).toBe(false)
    expect(queue.dequeue()).toBe(1)
    expect(queue.dequeue()).toBe(2)
    expect(queue.dequeue()).toBe(3)
    expect(queue.isEmpty).toBe(true)
  })

  describe('iterator', () => {
    it('dequeues all the items', () => {
      const queue = createQueue()

      expect([...queue]).toStrictEqual([])

      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)

      expect([...queue]).toStrictEqual([1, 2, 3])

      expect(queue.isEmpty).toBe(true)
      expect([...queue]).toStrictEqual([])
    })
  })
})
