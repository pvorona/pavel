import { IdleValue, idleValue } from './idleValue'
import { requestIdleCallback, cancelIdleCallback } from '../requestIdleCallback'
import { Lambda } from '@pavel/types'

const INITIAL_IDLE_CALLBACK_ID = 1
const IDLE_CALLBACK_DELAY = 1000

let nextIdleCallbackId = INITIAL_IDLE_CALLBACK_ID

jest.mock('../requestIdleCallback', () => ({
  requestIdleCallback: jest.fn((fn: Lambda) => {
    setTimeout(fn, IDLE_CALLBACK_DELAY)

    return nextIdleCallbackId++
  }),
  cancelIdleCallback: jest.fn(),
}))

describe('idleValue', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    nextIdleCallbackId = INITIAL_IDLE_CALLBACK_ID
  })

  it('immediately schedules idle task', () => {
    const computeValue = jest.fn(() => 5)

    expect(requestIdleCallback).not.toHaveBeenCalled()

    idleValue(computeValue)

    expect(requestIdleCallback).toHaveBeenCalledTimes(1)
  })

  describe('when fulfilled', () => {
    let idle: IdleValue<number>
    const computeValue = jest.fn(() => 5)

    beforeEach(() => {
      idle = idleValue(computeValue)
      jest.advanceTimersByTime(IDLE_CALLBACK_DELAY)
    })

    afterEach(() => {
      jest.clearAllMocks()
      nextIdleCallbackId = INITIAL_IDLE_CALLBACK_ID
    })

    it('calling get returns cached value', () => {
      expect(idle.get()).toBe(5)
      expect(idle.get()).toBe(5)
      expect(idle.get()).toBe(5)
      expect(computeValue).toHaveBeenCalledTimes(1)
    })
  })

  describe('when pending', () => {
    const computeValue = jest.fn(() => 5)

    afterEach(() => {
      jest.clearAllMocks()
      nextIdleCallbackId = INITIAL_IDLE_CALLBACK_ID
    })

    it('calling get cancels idle task, computes the value, returns the result and caches it', () => {
      expect(cancelIdleCallback).not.toHaveBeenCalled()

      const CALLBACK_ID = nextIdleCallbackId
      const idle = idleValue(computeValue)

      expect(idle.get()).toBe(5)

      expect(cancelIdleCallback).toHaveBeenCalledWith(CALLBACK_ID)
      expect(cancelIdleCallback).toHaveBeenCalledTimes(1)

      expect(idle.get()).toBe(5)
      expect(idle.get()).toBe(5)
      expect(idle.get()).toBe(5)

      expect(computeValue).toHaveBeenCalledTimes(1)

      expect(cancelIdleCallback).toHaveBeenCalledTimes(1)
    })
  })
})
