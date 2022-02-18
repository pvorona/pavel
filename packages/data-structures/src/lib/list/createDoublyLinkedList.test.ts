import {
  createDoublyLinkedList,
  EMPTY_LIST_STRING,
} from './createDoublyLinkedList'
import { List, ListNode } from './types'

describe('createDoublyLinkedList', () => {
  let list: List<number>

  beforeEach(() => {
    list = createDoublyLinkedList<number>()
  })

  describe('when initialized', () => {
    it('first is null', () => {
      expect(list.first()).toBeNull()
    })

    it('last is null', () => {
      expect(list.last()).toBeNull()
    })

    it('serializes to empty', () => {
      expect(list.toJSON()).toBe(EMPTY_LIST_STRING)
    })
  })

  it('removes a node from single node list', () => {
    const node = list.push(1)
    list.removeNode(node)

    expect(list.first()).toBe(null)
    expect(list.last()).toBe(null)
  })

  describe('when pushing single value', () => {
    let node: ListNode<number>

    beforeEach(() => {
      list = createDoublyLinkedList<number>()
      node = list.push(1)
    })

    it('sets first and last pointers', () => {
      expect(list.first()).toBe(node)
      expect(list.last()).toBe(node)
    })

    it('serializes to new node', () => {
      expect(list.toJSON()).toBe('1')
    })
  })

  describe('when pushing multiple values', () => {
    let node1: ListNode<number>
    let node2: ListNode<number>
    let node3: ListNode<number>

    beforeEach(() => {
      node1 = list.push(1)
      node2 = list.push(2)
      node3 = list.push(3)
    })

    it('sets first, last and serializes to all values', () => {
      expect(list.first()).toBe(node1)
      expect((list.first() as ListNode<number>).next).toBe(node2)
      expect(list.last()).toBe(node3)
      expect((list.last() as ListNode<number>).prev).toBe(node2)
      expect(list.toJSON()).toBe('1 <-> 2 <-> 3')
    })
  })

  describe('when removing the node', () => {
    let node1: ListNode<number>
    let node2: ListNode<number>
    let node3: ListNode<number>

    beforeEach(() => {
      node1 = list.push(1)
      node2 = list.push(2)
      node3 = list.push(3)
    })

    it('updates first pointer if removing first node', () => {
      list.removeNode(node1)

      expect(list.first()).toBe(node2)
      expect((list.first() as ListNode<number>).next).toBe(node3)
      expect(list.last()).toBe(node3)
      expect((list.last() as ListNode<number>).prev).toBe(node2)
      expect(list.toJSON()).toBe('2 <-> 3')
    })

    it('updates last pointer if removing last node', () => {
      list.removeNode(node3)

      expect(list.first()).toBe(node1)
      expect((list.first() as ListNode<number>).next).toBe(node2)
      expect(list.last()).toBe(node2)
      expect((list.last() as ListNode<number>).prev).toBe(node1)
      expect(list.toJSON()).toBe('1 <-> 2')
    })

    it('updates nearby nodes pointer when removing node in the middle', () => {
      list.removeNode(node2)

      expect(list.first()).toBe(node1)
      expect((list.first() as ListNode<number>).next).toBe(node3)
      expect(list.last()).toBe(node3)
      expect((list.last() as ListNode<number>).prev).toBe(node1)
      expect(list.toJSON()).toBe('1 <-> 3')
    })
  })
})
