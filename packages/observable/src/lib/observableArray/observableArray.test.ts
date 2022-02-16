import { observable } from '../observable'
import { observableArray } from './observableArray'

describe('observableArray', () => {
  it('returns initial value', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    const o3 = observable(3)
    const o = observableArray([o1, o2, o3])

    expect(o.get()).toStrictEqual([1, 2, 3])
  })

  it('notifies observes when any of the dependencies change', () => {
    const observer = jest.fn()

    const o1 = observable(1)
    const o2 = observable(2)
    const o3 = observable(3)
    const o = observableArray([o1, o2, o3])

    o.observe(observer)

    expect(observer).not.toHaveBeenCalled()

    o1.set(4)

    expect(o.get()).toStrictEqual([4, 2, 3])
    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenLastCalledWith([4, 2, 3])

    o1.set(5)

    expect(o.get()).toStrictEqual([4, 5, 3])
    expect(observer).toHaveBeenCalledTimes(2)
    expect(observer).toHaveBeenLastCalledWith([4, 5, 3])

    o1.set(6)

    expect(o.get()).toStrictEqual([4, 5, 6])
    expect(observer).toHaveBeenCalledTimes(3)
    expect(observer).toHaveBeenLastCalledWith([4, 5, 6])
  })

  it.todo("doesn't notify observer after unobserve is called")
})
