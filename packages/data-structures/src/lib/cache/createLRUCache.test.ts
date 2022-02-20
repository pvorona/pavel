import { createLRUCache } from './createLRUCache'

describe('cache (LRU)', () => {
  describe.each([0, -1, -10])(
    'when initialized with non-positive size (%s)',
    max => {
      it('throws', () => {
        expect(() => createLRUCache({ max })).toThrow(
          `Expected positive integer, received: ${max}`,
        )
      })
    },
  )

  describe('set', () => {
    it('adds items to cache', () => {
      const cache = createLRUCache({
        max: 3,
      })

      expect(cache.has(1)).toBe(false)
      expect(cache.has(2)).toBe(false)
      expect(cache.has(3)).toBe(false)

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')

      expect(cache.has(1)).toBe(true)
      expect(cache.has(2)).toBe(true)
      expect(cache.has(3)).toBe(true)

      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
      expect(cache.get(3)).toBe('c')
    })

    it('removes oldest value when reaching max size', () => {
      const cache = createLRUCache({
        max: 3,
      })

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')
      cache.set(4, 'd')

      expect(cache.has(2)).toBe(true)
      expect(cache.has(3)).toBe(true)
      expect(cache.has(4)).toBe(true)

      expect(cache.get(2)).toBe('b')
      expect(cache.get(3)).toBe('c')
      expect(cache.get(4)).toBe('d')
    })

    it('updates usage order', () => {
      const cache = createLRUCache({
        max: 3,
      })

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')

      cache.set(1, 'e')
      cache.set(4, 'f')

      expect(cache.has(2)).toBe(false)
      expect(cache.has(1)).toBe(true)
      expect(cache.has(3)).toBe(true)
      expect(cache.has(4)).toBe(true)
    })
  })

  describe('get', () => {
    it('throws when getting non-existent value', () => {
      const cache = createLRUCache({
        max: 3,
      })

      expect(() => cache.get(0)).toThrow(
        `Trying to get by non-existent key: ${0}`,
      )
      expect(() => cache.get(1)).toThrow(
        `Trying to get by non-existent key: ${1}`,
      )
      expect(() => cache.get(2)).toThrow(
        `Trying to get by non-existent key: ${2}`,
      )
      expect(() => cache.get(3)).toThrow(
        `Trying to get by non-existent key: ${3}`,
      )
    })

    it('updates usage order', () => {
      const cache = createLRUCache({
        max: 3,
      })

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')

      cache.get(1)
      cache.set(4, 'f')

      expect(cache.has(2)).toBe(false)
      expect(cache.has(1)).toBe(true)
      expect(cache.has(3)).toBe(true)
      expect(cache.has(4)).toBe(true)
    })

    it('returns cached value', () => {
      const cache = createLRUCache({
        max: 3,
      })

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')

      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
      expect(cache.get(3)).toBe('c')
    })
  })

  describe('has', () => {
    it('returns true for cached items and false for non cached', () => {
      const cache = createLRUCache({
        max: 3,
      })

      expect(cache.has(0)).toBe(false)
      expect(cache.has(1)).toBe(false)
      expect(cache.has(2)).toBe(false)
      expect(cache.has(3)).toBe(false)
      expect(cache.has(4)).toBe(false)

      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')

      expect(cache.has(0)).toBe(false)
      expect(cache.has(1)).toBe(true)
      expect(cache.has(2)).toBe(true)
      expect(cache.has(3)).toBe(true)
      expect(cache.has(4)).toBe(false)
    })
  })
})
