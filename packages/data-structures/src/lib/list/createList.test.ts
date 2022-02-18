import { ListNode } from '.'
import { createList, EMPTY_LIST_STRING, List, createNode } from './createList'

describe('createList', () => {
  describe('when initialized', () => {
    let list: List<number>

    beforeEach(() => {
      list = createList<number>()
    })

    it('first is null', () => {
      expect(list.getFirst()).toBeNull()
    })

    it('last is null', () => {
      expect(list.getLast()).toBeNull()
    })

    it('serializes to empty', () => {
      expect(list.toJSON()).toBe(EMPTY_LIST_STRING)
    })

    describe('when appending node', () => {
      let node: ListNode<number>

      beforeEach(() => {
        node = createNode(1)
        list = createList<number>()
        list.append(node)
      })

      it('adds node to the end', () => {
        expect(list.getLast()).toBe(node)
      })

      it('sets first and last pointers', () => {
        expect(list.getFirst()).toBe(node)
        expect(list.getLast()).toBe(node)
      })

      it('serializes to new node', () => {
        expect(list.toJSON()).toBe('1')
      })
    })

    describe('when removing the node', () => {
      let node1: ListNode<number>
      let node2: ListNode<number>
      let node3: ListNode<number>

      beforeEach(() => {
        node1 = createNode(1)
        node2 = createNode(2)
        node3 = createNode(3)

        list.append(node1)
        list.append(node2)
        list.append(node3)
      })

      it('check', () => {
        expect(list.getFirst()).toBe(node1)
        expect(list.getLast()).toBe(node3)
        expect(list.toJSON()).toBe('1 -> 2 -> 3')
      })

      it('updates first pointer if removing first node', () => {
        list.remove(node1)

        expect(list.getFirst()).toBe(node2)
        expect(list.getLast()).toBe(node3)
        expect(list.toJSON()).toBe('2 -> 3')
      })

      it('updates last pointer if removing last node', () => {
        list.remove(node3)

        expect(list.getFirst()).toBe(node1)
        expect(list.getLast()).toBe(node2)
        expect(list.toJSON()).toBe('1 -> 2')
      })
    })
  })
})
