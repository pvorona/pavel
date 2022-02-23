import { computeLazy } from './computeLazy'
import { observable } from '../observable'

// observers are called with no values
//lazy of lazy

describe('computeLazy', () => {
  const observer = jest.fn()

  afterEach(() => {
    observer.mockClear()
  })

  it('compute is not called immediately', () => {
    const o1 = observable(1)
    const o2 = observable(2)

    computeLazy([o1, o2], observer)

    expect(observer).not.toHaveBeenCalled()
  })

  it('compute is called when calling .value and cached', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    observer.mockImplementation((...args: unknown[]) => args)

    const c = computeLazy([o1, o2], observer)

    expect(c.value).toStrictEqual([1, 2])
    expect(c.value).toStrictEqual([1, 2])
    expect(c.value).toStrictEqual([1, 2])

    expect(observer).toHaveBeenCalledTimes(1)
  })

  it('compute is not called on any dependency change', () => {
    const o1 = observable(1)
    const o2 = observable(2)

    computeLazy([o1, o2], observer)

    o1.value = 3
    o2.value = 4

    expect(observer).not.toHaveBeenCalled()
  })

  it('compute is called when calling .value after any dependency change', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    observer.mockImplementation((...args: unknown[]) => args)

    const c = computeLazy([o1, o2], observer)

    expect(c.value).toStrictEqual([1, 2])

    o1.value = 3
    o2.value = 4

    expect(c.value).toStrictEqual([3, 4])
    expect(c.value).toStrictEqual([3, 4])
    expect(c.value).toStrictEqual([3, 4])
    expect(observer).toHaveBeenNthCalledWith(1, 1, 2)
    expect(observer).toHaveBeenNthCalledWith(2, 3, 4)
    expect(observer).toHaveBeenCalledTimes(2)
  })

  it('observer is not called after unobserve is called', () => {
    const o1 = observable(1)
    const o2 = observable(2)

    const c = computeLazy([o1, o2], jest.fn())

    const unobserve = c.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o1.value = 3

    expect(observer).toHaveBeenCalledTimes(1)

    unobserve()
    o2.value = 4

    expect(observer).toHaveBeenCalledTimes(1)
  })
})
