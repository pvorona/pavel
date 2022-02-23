import { observable, isProxy } from './observable'

it('initializes with the value', () => {
  const o = observable(1)

  expect(o.value).toStrictEqual(1)
})

it('sets new value', () => {
  const o = observable(1)

  o.value = 2

  expect(o.value).toStrictEqual(2)

  o.value = 3

  expect(o.value).toStrictEqual(3)
})

it('observer is notified when setting new value', () => {
  const o = observable(1)
  const observer = jest.fn()

  o.observe(observer)

  expect(observer).toBeCalledTimes(0)

  o.value += 1

  expect(observer).toBeCalledTimes(1)
  expect(observer).toHaveBeenLastCalledWith(2)

  o.value = 3

  expect(observer).toBeCalledTimes(2)
  expect(observer).toHaveBeenLastCalledWith(3)

  o.value = 4

  expect(observer).toBeCalledTimes(3)
  expect(observer).toHaveBeenLastCalledWith(4)
})

it('observer is not notified when setting the same value', () => {
  const o = observable(1)
  const observer = jest.fn()

  o.observe(observer)

  o.value = 1
  o.value = 1
  o.value = 1

  expect(observer).toBeCalledTimes(0)

  o.value = 2

  expect(observer).toBeCalledTimes(1)

  o.value = 2
  o.value = 2
  o.value = 2

  expect(observer).toBeCalledTimes(1)
})

it('observer is not notified when setting new value after unobserve is called', () => {
  const o = observable(1)
  const observer = jest.fn()

  const unobserve = o.observe(observer)

  unobserve()

  o.value = 2
  o.value = 3
  o.value = 4

  expect(observer).toBeCalledTimes(0)
})

it('call unobserve multiple times', () => {
  const o = observable(1)
  const observer = jest.fn()

  const unobserve = o.observe(observer)

  unobserve()
  unobserve()
  unobserve()

  o.value = 2
  o.value = 3
  o.value = 4

  expect(observer).toBeCalledTimes(0)
})

it('all observers are notified when setting new value', () => {
  const o = observable(1)
  const observer1 = jest.fn()
  const observer2 = jest.fn()

  o.observe(observer1)
  o.observe(observer2)

  expect(observer1).toBeCalledTimes(0)
  expect(observer2).toBeCalledTimes(0)

  o.value += 1

  expect(observer1).toBeCalledTimes(1)
  expect(observer1).toHaveBeenLastCalledWith(2)
  expect(observer2).toBeCalledTimes(1)
  expect(observer2).toHaveBeenLastCalledWith(2)

  o.value = 3

  expect(observer1).toBeCalledTimes(2)
  expect(observer1).toHaveBeenLastCalledWith(3)
  expect(observer2).toBeCalledTimes(2)
  expect(observer2).toHaveBeenLastCalledWith(3)

  o.value = 4

  expect(observer1).toBeCalledTimes(3)
  expect(observer1).toHaveBeenLastCalledWith(4)
  expect(observer2).toBeCalledTimes(3)
  expect(observer2).toHaveBeenLastCalledWith(4)
})

it('unregistering one observer does not change the behavior of other observers', () => {
  const o = observable(1)
  const observer1 = jest.fn()
  const observer2 = jest.fn()
  const observer3 = jest.fn()

  const unobserve = o.observe(observer1)
  o.observe(observer2)
  o.observe(observer3)

  unobserve()

  expect(observer2).toBeCalledTimes(0)
  expect(observer3).toBeCalledTimes(0)

  o.value = 2

  expect(observer2).toBeCalledTimes(1)
  expect(observer2).toHaveBeenLastCalledWith(2)
  expect(observer3).toBeCalledTimes(1)
  expect(observer3).toHaveBeenLastCalledWith(2)

  o.value += 1

  expect(observer2).toBeCalledTimes(2)
  expect(observer2).toHaveBeenLastCalledWith(3)
  expect(observer3).toBeCalledTimes(2)
  expect(observer3).toHaveBeenLastCalledWith(3)

  o.value = 4

  expect(observer2).toBeCalledTimes(3)
  expect(observer2).toHaveBeenLastCalledWith(4)
  expect(observer3).toBeCalledTimes(3)
  expect(observer3).toHaveBeenLastCalledWith(4)
})

describe('reference types', () => {
  it('works with objects', () => {
    const o = observable({ a: { b: 1 } })

    expect(o.value).toStrictEqual({ a: { b: 1 } })

    expect(o.value.a).toStrictEqual({ b: 1 })
    expect(o.value.a.b).toBe(1)
  })

  it('notifies observer when value is reassigned', () => {
    const observer = jest.fn()
    const o = observable({ a: { b: 1 } })

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    const newValue = { a: { b: 2 } }
    o.value = newValue

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith(newValue)
  })

  it('returns proxy when getting nested objects', () => {
    const o = observable({ a: { b: 1 } })

    const proxy = o.value.a

    expect(isProxy(proxy)).toBe(true)
  })

  it('notifies observer when nested property changes', () => {
    const observer = jest.fn()
    const o = observable({ a: { b: { c: 1 } } })

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o.value.a.b.c = 2

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith({ a: { b: { c: 2 } } })
  })

  it('notifies observer when array elements change', () => {
    const observer = jest.fn()
    const o = observable([1, 2, 3])

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o.value[0] = 4

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith([4, 2, 3])
  })

  it('works with array modification methods', () => {
    const observer = jest.fn()
    const o = observable([1, 2, 3])

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o.value.sort((a, b) => b - a)

    expect(observer).toHaveBeenCalledTimes(2)
    expect(observer).toHaveBeenCalledWith([3, 2, 1])
  })

  it("doesn't make original object a proxy", () => {
    const object = { a: { b: { c: 1 } } }
    observable(object)

    expect(isProxy(object)).toBe(false)
  })

  it('converts proxy to raw object when setting back', () => {
    const observer = jest.fn()
    const object1 = { a: { b: { c: 1 } } }
    const object2 = { a: { b: { c: 2 } } }

    const o1 = observable(object1)
    const o2 = observable(object2)

    o1.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o1.value.a.b = o2.value.a.b

    expect(isProxy(object1.a.b)).toBe(false)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith({ a: { b: { c: 2 } } })
  })

  it("doesn't notify observers when setting the same nested value", () => {
    const observer = jest.fn()
    const o = observable({ a: { b: { c: 1 } } })

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o.value.a.b.c = 1

    expect(observer).not.toHaveBeenCalled()
  })

  describe('deleting properties', () => {
    it('notifies observers when the property is deleted', () => {
      const observer = jest.fn()
      const o = observable<{ a: { b: { c?: number } } }>({ a: { b: { c: 1 } } })

      o.observe(observer)

      expect(observer).not.toHaveBeenCalled()

      delete o.value.a.b.c

      expect(observer).toHaveBeenCalledTimes(1)
      expect(observer).toHaveBeenCalledWith({ a: { b: {} } })
    })

    it("doesn't notify observer when trying to delete non-existent property", () => {
      const observer = jest.fn()
      const o = observable<{ a: { b: { c?: number } } }>({ a: { b: {} } })

      o.observe(observer)

      expect(observer).not.toHaveBeenCalled()

      delete o.value.a.b.c

      expect(observer).not.toHaveBeenCalled()
    })
  })

  describe('preserves proxy for referentially equal values', () => {
    it('returns the same proxy for the same object', () => {
      const object = { a: 1 }
      const o1 = observable(object)
      const o2 = observable(object)

      expect(o1.value).toBe(o2.value)
    })

    it('returns the same proxy for the same array', () => {
      const array = [1, true, 'a']
      const o1 = observable(array)
      const o2 = observable(array)

      expect(o1.value).toBe(o2.value)
    })
  })
})
