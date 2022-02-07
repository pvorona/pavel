import { observable } from '../observable'
import { computeLazy } from '../computeLazy'
import { observe } from './observe'

describe('observe', () => {
  const observer = jest.fn()

  afterEach(() => {
    observer.mockClear()
  })

  describe('with lazy observables', () => {
    describe('without options', () => {
      it('calls observer immediately after initialization', () => {
        const o1 = observable(1)
        const o2 = observable(2)
        const o3 = observable(3)
        const o4 = observable(4)

        const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
        const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
        const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

        observe([o1, o2, o3, o4, l1, l2, l3], observer)

        expect(observer).toHaveBeenCalledTimes(1)
        expect(observer).toHaveBeenCalledWith(1, 2, 3, 4, 3, 6, 10)
      })

      it('calls observer every time any observed value changes', () => {
        const o1 = observable(1)
        const o2 = observable(2)
        const o3 = observable(3)
        const o4 = observable(4)

        const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
        const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
        const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

        observe([o1, o2, o3, o4, l1, l2, l3], observer)

        o1.set(5)

        expect(observer).toHaveBeenCalledTimes(
          1 + // initialization
            1 + // o1
            1 + // l1
            1 + // l2
            1, // l3
        )
        expect(observer).toHaveBeenNthCalledWith(2, 5, 2, 3, 4, 7, 10, 14)

        o3.set(6)

        expect(observer).toHaveBeenCalledTimes(
          1 + // initialization
            1 + // o1
            1 + // l1
            1 + // l2
            1 + // l3
            1 + // o3
            1 + // l2
            1, // l3
        )
        expect(observer).toHaveBeenNthCalledWith(8, 5, 2, 6, 4, 7, 13, 17)

        o4.set(7)

        expect(observer).toHaveBeenCalledTimes(
          1 + // initialization
            1 + // o1
            1 + // l1
            1 + // l2
            1 + // l3
            1 + // o3
            1 + // l2
            1 + // l3
            1 + // o4
            1, // l3
        )
        expect(observer).toHaveBeenNthCalledWith(10, 5, 2, 6, 7, 7, 13, 20)
      })

      it("doesn't call observer if observed values don't change", () => {
        const o1 = observable(1)
        const o2 = observable(2)
        const o3 = observable(3)
        const o4 = observable(4)

        const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
        const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
        const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

        observe([o1, o2, o3, o4, l1, l2, l3], observer)

        o1.set(1)
        o1.set(1)
        o1.set(1)

        o2.set(2)
        o2.set(2)
        o2.set(2)

        o3.set(3)
        o3.set(3)
        o3.set(3)

        o4.set(4)
        o4.set(4)
        o4.set(4)

        expect(observer).toHaveBeenCalledTimes(1)
      })
      it("doesn't call observer if any observed value changes after unsubscribing", () => {
        const o1 = observable(1)
        const o2 = observable(2)
        const o3 = observable(3)
        const o4 = observable(4)

        const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
        const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
        const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

        const unobserve = observe([o1, o2, o3, o4, l1, l2, l3], observer)

        unobserve()

        o1.set(5)
        o2.set(6)
        o3.set(7)
        o4.set(8)

        expect(observer).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('with options', () => {
    it("doesn't invoke observer immediately when fireImmediately=false", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        fireImmediately: false,
      })

      expect(observer).toHaveBeenCalledTimes(0)
    })

    it("doesn't invoke observer immediately when fireImmediately=false, collectValues=true", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        fireImmediately: false,
        collectValues: true,
      })

      expect(observer).toHaveBeenCalledTimes(0)
    })

    it("doesn't invoke observer immediately when fireImmediately=false, collectValues=false", () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        collectValues: false,
        fireImmediately: false,
      })

      expect(observer).toHaveBeenCalledTimes(0)
    })

    it('invokes observer immediately when fireImmediately=true', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        fireImmediately: true,
      })

      expect(observer).toHaveBeenCalledTimes(1)
    })

    it('invokes observer immediately when fireImmediately=true, collectValues=false', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        fireImmediately: true,
        collectValues: false,
      })

      expect(observer).toHaveBeenCalledTimes(1)
    })

    it('invokes observer immediately when fireImmediately=true, collectValues=true', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        fireImmediately: true,
        collectValues: true,
      })

      expect(observer).toHaveBeenCalledTimes(1)
    })

    it('collects values when collectValues=true', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        collectValues: true,
      })

      expect(observer).toHaveBeenLastCalledWith(1, 2, 3, 4, 3, 6, 10)
    })

    it('collects values when collectValues=true, fireImmediately=false', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        collectValues: true,
        fireImmediately: false,
      })

      o1.set(5)

      expect(observer).toHaveBeenLastCalledWith(5, 2, 3, 4, 7, 10, 14)
    })

    it('collects values when collectValues=true, fireImmediately=true', () => {
      const o1 = observable(1)
      const o2 = observable(2)
      const o3 = observable(3)
      const o4 = observable(4)

      const l1 = computeLazy([o1, o2], (o1, o2) => o1 + o2)
      const l2 = computeLazy([l1, o3], (l1, o3) => l1 + o3)
      const l3 = computeLazy([l2, o4], (l2, o4) => l2 + o4)

      observe([o1, o2, o3, o4, l1, l2, l3], observer, {
        collectValues: true,
        fireImmediately: true,
      })

      expect(observer).toHaveBeenLastCalledWith(1, 2, 3, 4, 3, 6, 10)
    })
  })
})
