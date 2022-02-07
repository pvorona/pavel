/**
 * @jest-environment jsdom
 */

import { effect } from './effect'
import { observable } from '../observable'

const FRAME_INTERVAL = 100

describe('effect', () => {
  let frameIndex = 0

  beforeAll(() => {
    jest.useFakeTimers()

    window.requestAnimationFrame = (callback: (n: number) => void) => {
      setTimeout(() => callback(0), FRAME_INTERVAL)

      return frameIndex++
    }
  })

  it('schedules effect execution immediately', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    const mock = jest.fn()

    effect([o1, o2], mock)

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenCalledWith(1, 2)
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('schedules task every time any observed value changes', () => {
    const o1 = observable(1)
    const o2 = observable(2)
    const mock = jest.fn()

    effect([o1, o2], mock)

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    mock.mockClear()

    o1.set(3)

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenLastCalledWith(3, 2)
    expect(mock).toHaveBeenCalledTimes(1)

    o2.set(4)

    expect(mock).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenLastCalledWith(3, 4)
    expect(mock).toHaveBeenCalledTimes(2)
  })
})

it('does not fire after unobserve is called', () => {
  const o1 = observable(1)
  const o2 = observable(2)
  const mock = jest.fn()

  const unobserve = effect([o1, o2], mock)

  expect(mock).not.toHaveBeenCalled()

  jest.advanceTimersByTime(FRAME_INTERVAL)

  expect(mock).toHaveBeenCalledWith(1, 2)
  expect(mock).toHaveBeenCalledTimes(1)

  unobserve()

  o1.set(3)
  o2.set(4)

  jest.advanceTimersByTime(FRAME_INTERVAL)

  expect(mock).toHaveBeenCalledTimes(1)
})

it('performs task with the latest values and cancel all previous tasks', () => {
  const o1 = observable(1)
  const o2 = observable(2)
  const mock = jest.fn()

  effect([o1, o2], mock)

  expect(mock).not.toHaveBeenCalled()

  jest.advanceTimersByTime(FRAME_INTERVAL)

  mock.mockClear()

  o1.set(3)
  o2.set(4)
  o1.set(5)
  o1.set(6)

  expect(mock).not.toHaveBeenCalled()

  jest.advanceTimersByTime(FRAME_INTERVAL)

  expect(mock).toHaveBeenLastCalledWith(6, 4)
  expect(mock).toHaveBeenCalledTimes(1)
})
