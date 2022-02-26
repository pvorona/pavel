import { createDoublyLinkedList } from './DoublyLinkedList'
import { List, ListNode } from './types'

describe('createDoublyLinkedList', () => {
  let list: List<number>

  beforeEach(() => {
    list = createDoublyLinkedList<number>()
  })

  describe('when initialized', () => {
    it('first is null', () => {
      expect(list.head).toBeNull()
    })

    it('last is null', () => {
      expect(list.tail).toBeNull()
    })

    it('size is 0', () => {
      expect(list.size).toBe(0)
    })

    it('serializes to empty', () => {
      expect([...list]).toStrictEqual([])
    })
  })

  it('removes a node from single node list', () => {
    const node = list.append(1)
    list.removeNode(node)

    expect(list.head).toBe(null)
    expect(list.tail).toBe(null)
  })

  describe('when pushing single value', () => {
    let node: ListNode<number>

    beforeEach(() => {
      list = createDoublyLinkedList<number>()
      node = list.append(1)
    })

    it('sets first and last pointers', () => {
      expect(list.head).toBe(node)
      expect(list.tail).toBe(node)
    })

    it('serializes to new node', () => {
      expect([...list]).toStrictEqual([1])
    })

    it('size is 1', () => {
      expect(list.size).toBe(1)
    })
  })

  describe('when pushing 3 values', () => {
    let node1: ListNode<number>
    let node2: ListNode<number>
    let node3: ListNode<number>

    beforeEach(() => {
      node1 = list.append(1)
      node2 = list.append(2)
      node3 = list.append(3)
    })

    it('sets size to 3', () => {
      expect(list.size).toBe(3)
    })

    it('sets first, last and serializes to all values', () => {
      expect(list.head).toBe(node1)
      expect((list.head as ListNode<number>).next).toBe(node2)
      expect(list.tail).toBe(node3)
      expect((list.tail as ListNode<number>).prev).toBe(node2)
      expect([...list]).toStrictEqual([1, 2, 3])
    })
  })

  describe('when removing the node', () => {
    let node1: ListNode<number>
    let node2: ListNode<number>
    let node3: ListNode<number>

    beforeEach(() => {
      node1 = list.append(1)
      node2 = list.append(2)
      node3 = list.append(3)
    })

    it('updates first pointer if removing first node', () => {
      list.removeNode(node1)

      expect(list.head).toBe(node2)
      expect((list.head as ListNode<number>).next).toBe(node3)
      expect(list.tail).toBe(node3)
      expect((list.tail as ListNode<number>).prev).toBe(node2)
      expect([...list]).toStrictEqual([2, 3])
    })

    it('updates last pointer if removing last node', () => {
      list.removeNode(node3)

      expect(list.head).toBe(node1)
      expect((list.head as ListNode<number>).next).toBe(node2)
      expect(list.tail).toBe(node2)
      expect((list.tail as ListNode<number>).prev).toBe(node1)
      expect([...list]).toStrictEqual([1, 2])
    })

    it('updates nearby nodes pointer when removing node in the middle', () => {
      list.removeNode(node2)

      expect(list.head).toBe(node1)
      expect((list.head as ListNode<number>).next).toBe(node3)
      expect(list.tail).toBe(node3)
      expect((list.tail as ListNode<number>).prev).toBe(node1)
      expect([...list]).toStrictEqual([1, 3])
    })

    it('decreases the size and updates isEmpty', () => {
      expect(list.isEmpty).toBe(false)

      list.removeNode(node1)

      expect(list.isEmpty).toBe(false)
      expect(list.size).toBe(2)

      list.removeNode(node2)

      expect(list.isEmpty).toBe(false)
      expect(list.size).toBe(1)

      list.removeNode(node3)

      expect(list.isEmpty).toBe(true)
      expect(list.size).toBe(0)

      list.removeNode(node3)

      expect(list.isEmpty).toBe(true)
      expect(list.size).toBe(0)
    })
  })

  describe('prepend', () => {
    it('adds node to the beginning of the array', () => {
      expect(list.toArray()).toStrictEqual([])

      list.prepend(1)

      expect(list.toArray()).toStrictEqual([1])

      list.prepend(2)

      expect(list.toArray()).toStrictEqual([2, 1])

      list.prepend(3)

      expect(list.toArray()).toStrictEqual([3, 2, 1])
    })
  })
})
