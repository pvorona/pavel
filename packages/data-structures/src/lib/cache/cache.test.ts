import { createLRUCache } from './createCache'

describe('cache (LRU)', () => {
  it('throws when received negative size', () => {
    expect(() => createLRUCache({ size: 0 })).toThrow(
      `Expected positive cache size, received ${0}`,
    )
    expect(() => createLRUCache({ size: -1 })).toThrow(
      `Expected positive cache size, received ${-1}`,
    )
  })

  it('adds items to cache', () => {
    const cache = createLRUCache({
      size: 3,
    })

    cache.set(1, 'a')
    cache.set(2, 'b')
    cache.set(3, 'c')

    expect(cache.has(1)).toBe(true)
    expect(cache.has(2)).toBe(true)
    expect(cache.has(3)).toBe(true)

    expect(cache.get(1)).toBe('a')
    expect(cache.get(2)).toBe('b')
    expect(cache.get(3)).toBe('c')

    cache.set(4, 'd')

    expect(cache.has(1)).toBe(false)
    expect(() => cache.get(1)).toThrow(
      `Trying to get by non-existent key. Key: ${1}`,
    )

    expect(cache.has(2)).toBe(true)
    expect(cache.has(3)).toBe(true)
    expect(cache.has(4)).toBe(true)

    expect(cache.get(2)).toBe('b')
    expect(cache.get(3)).toBe('c')
    expect(cache.get(4)).toBe('d')

    cache.set(2, 'e')

    expect(cache.has(2)).toBe(true)
    expect(cache.has(3)).toBe(true)
    expect(cache.has(4)).toBe(true)

    expect(cache.get(2)).toBe('e')
    expect(cache.get(3)).toBe('c')
    expect(cache.get(4)).toBe('d')

    cache.set(5, 'f')

    expect(cache.has(3)).toBe(false)
    expect(() => cache.get(3)).toThrow(
      `Trying to get by non-existent key. Key: ${3}`,
    )

    expect(cache.has(2)).toBe(true)
    expect(cache.has(4)).toBe(true)
    expect(cache.has(5)).toBe(true)

    expect(cache.get(2)).toBe('e')
    expect(cache.get(4)).toBe('d')
    expect(cache.get(5)).toBe('f')
  })
})
