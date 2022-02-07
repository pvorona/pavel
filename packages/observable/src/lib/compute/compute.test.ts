import { compute } from './compute'
import { observable } from '../observable'

describe('compute', () => {
  const performComputation = jest.fn(
    (a: number, b: number, c: number) => a + b + c,
  )

  afterEach(() => {
    performComputation.mockClear()
  })

  describe('with eager observables', () => {
    it('performs computation immediately after initialization', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      compute([o1, o2, o3], performComputation)

      expect(performComputation).toHaveBeenCalledTimes(1)
      expect(performComputation).toHaveBeenCalledWith(1, 2, 3)
    })

    it('performs computation every time any observed value changes', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      compute([o1, o2, o3], performComputation)

      o1.set(4)

      expect(performComputation).toHaveBeenCalledTimes(2)
      expect(performComputation).toHaveBeenLastCalledWith(4, 2, 3)

      o2.set(5)

      expect(performComputation).toHaveBeenCalledTimes(3)
      expect(performComputation).toHaveBeenLastCalledWith(4, 5, 3)

      o3.set(6)

      expect(performComputation).toHaveBeenCalledTimes(4)
      expect(performComputation).toHaveBeenLastCalledWith(4, 5, 6)
    })

    it("doesn't perform computation if observed values don't change", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)

      compute([o1, o2, o3], performComputation)

      o1.set(1)
      o1.set(1)
      o1.set(1)

      o2.set(2)
      o2.set(2)
      o2.set(2)

      o3.set(3)
      o3.set(3)
      o3.set(3)

      expect(performComputation).toHaveBeenCalledTimes(1)
    })

    it("memoizes computation result and doesn't perform computation when getting the result", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const c = compute([o1, o2, o3], performComputation)

      expect(c.get()).toStrictEqual(1 + 2 + 3)
      expect(c.get()).toStrictEqual(1 + 2 + 3)
      expect(c.get()).toStrictEqual(1 + 2 + 3)
      expect(performComputation).toHaveBeenCalledTimes(1)

      o1.set(4)

      expect(c.get()).toStrictEqual(4 + 2 + 3)
      expect(c.get()).toStrictEqual(4 + 2 + 3)
      expect(c.get()).toStrictEqual(4 + 2 + 3)
      expect(performComputation).toHaveBeenCalledTimes(2)

      o2.set(5)

      expect(c.get()).toStrictEqual(4 + 5 + 3)
      expect(c.get()).toStrictEqual(4 + 5 + 3)
      expect(c.get()).toStrictEqual(4 + 5 + 3)
      expect(performComputation).toHaveBeenCalledTimes(3)

      o3.set(6)

      expect(c.get()).toStrictEqual(4 + 5 + 6)
      expect(c.get()).toStrictEqual(4 + 5 + 6)
      expect(c.get()).toStrictEqual(4 + 5 + 6)
      expect(performComputation).toHaveBeenCalledTimes(4)
    })
  })

  it('calls observer with new value when the value changes', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    const o3 = observable(3)
    const c = compute([o1, o2, o3], performComputation)
    const observer = jest.fn()

    c.observe(observer)

    expect(observer).toHaveBeenCalledTimes(0)

    o1.set(4)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenLastCalledWith(4 + 2 + 3)

    o2.set(5)

    expect(observer).toHaveBeenCalledTimes(2)
    expect(observer).toHaveBeenLastCalledWith(4 + 5 + 3)

    o3.set(6)

    expect(observer).toHaveBeenCalledTimes(3)
    expect(observer).toHaveBeenLastCalledWith(4 + 5 + 6)

    o1.set(4)
    o1.set(4)
    o1.set(4)

    o2.set(5)
    o2.set(5)
    o2.set(5)

    o3.set(6)
    o3.set(6)
    o3.set(6)

    expect(observer).toHaveBeenCalledTimes(3)
  })
})
