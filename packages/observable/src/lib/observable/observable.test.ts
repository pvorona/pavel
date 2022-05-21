import { observable } from './observable'

it('initializes with the value', () => {
  const o = observable(1)

  expect(o.get()).toStrictEqual(1)
})

it('sets new value', () => {
  const o = observable(1)

  o.set(2)

  expect(o.get()).toStrictEqual(2)

  o.set(3)

  expect(o.get()).toStrictEqual(3)
})

it('observer is notified when setting new value', () => {
  const o = observable(1)
  const observer = jest.fn()

  o.observe(observer)

  expect(observer).toBeCalledTimes(0)

  o.set(o.get() + 1)

  expect(observer).toBeCalledTimes(1)
  expect(observer).toHaveBeenLastCalledWith(2)

  o.set(3)

  expect(observer).toBeCalledTimes(2)
  expect(observer).toHaveBeenLastCalledWith(3)

  o.set(4)

  expect(observer).toBeCalledTimes(3)
  expect(observer).toHaveBeenLastCalledWith(4)
})

it('observer is not notified when setting the same value', () => {
  const o = observable(1)
  const observer = jest.fn()

  o.observe(observer)

  o.set(1)
  o.set(1)
  o.set(1)

  expect(observer).toBeCalledTimes(0)

  o.set(2)

  expect(observer).toBeCalledTimes(1)

  o.set(2)
  o.set(2)
  o.set(2)

  expect(observer).toBeCalledTimes(1)
})

it('observer is not notified when setting new value after unobserve is called', () => {
  const o = observable(1)
  const observer = jest.fn()

  const unobserve = o.observe(observer)

  unobserve()

  o.set(2)
  o.set(3)
  o.set(4)

  expect(observer).toBeCalledTimes(0)
})

it('call unobserve multiple times', () => {
  const o = observable(1)
  const observer = jest.fn()

  const unobserve = o.observe(observer)

  unobserve()
  unobserve()
  unobserve()

  o.set(2)
  o.set(3)
  o.set(4)

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

  o.set(o.get() + 1)

  expect(observer1).toBeCalledTimes(1)
  expect(observer1).toHaveBeenLastCalledWith(2)
  expect(observer2).toBeCalledTimes(1)
  expect(observer2).toHaveBeenLastCalledWith(2)

  o.set(3)

  expect(observer1).toBeCalledTimes(2)
  expect(observer1).toHaveBeenLastCalledWith(3)
  expect(observer2).toBeCalledTimes(2)
  expect(observer2).toHaveBeenLastCalledWith(3)

  o.set(4)

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

  o.set(2)

  expect(observer2).toBeCalledTimes(1)
  expect(observer2).toHaveBeenLastCalledWith(2)
  expect(observer3).toBeCalledTimes(1)
  expect(observer3).toHaveBeenLastCalledWith(2)

  o.set(o.get() + 1)

  expect(observer2).toBeCalledTimes(2)
  expect(observer2).toHaveBeenLastCalledWith(3)
  expect(observer3).toBeCalledTimes(2)
  expect(observer3).toHaveBeenLastCalledWith(3)

  o.set(4)

  expect(observer2).toBeCalledTimes(3)
  expect(observer2).toHaveBeenLastCalledWith(4)
  expect(observer3).toBeCalledTimes(3)
  expect(observer3).toHaveBeenLastCalledWith(4)
})

describe('reference types', () => {
  it('works with objects', () => {
    const o = observable({ a: { b: 1 } })

    expect(o.get()).toStrictEqual({ a: { b: 1 } })
  })

  it('notifies observer when value is reassigned', () => {
    const observer = jest.fn()
    const o = observable({ a: { b: 1 } })

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    const newValue = { a: { b: 2 } }
    o.set(newValue)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith(newValue)
  })
})
