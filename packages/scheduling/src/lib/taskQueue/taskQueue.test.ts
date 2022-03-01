import { scheduleTask } from './taskQueue'
import { PRIORITY } from '../constants'

const FRAME_DELAY = 100
const IDLE_DELAY = 10

describe('scheduleTask', () => {
  let frameIndex = 0
  let idleIndex = 0

  beforeAll(() => {
    jest.useFakeTimers()

    window.requestAnimationFrame = (callback: (n: number) => void) => {
      setTimeout(() => callback(0), FRAME_DELAY)

      return frameIndex++
    }

    window.requestIdleCallback = (
      callback: (deadline: IdleDeadline) => void,
    ) => {
      const deadline = {
        didTimeout: false,
        timeRemaining() {
          return 1
        },
      }

      setTimeout(() => callback(deadline), IDLE_DELAY)

      return idleIndex++
    }
  })

  it.todo('tasks scheduling other tasks during different phases')
  // throttle idle tasks

  it('schedules tasks and executes them in specified order', () => {
    const mock = jest.fn()

    scheduleTask(() => mock('write 1'), PRIORITY.WRITE)
    scheduleTask(() => mock('compute 1'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('read 1'), PRIORITY.READ)
    scheduleTask(() => mock('before render 1'), PRIORITY.BEFORE_RENDER)

    scheduleTask(() => mock('before render 2'), PRIORITY.BEFORE_RENDER)
    scheduleTask(() => mock('compute 2'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 2'), PRIORITY.WRITE)
    scheduleTask(() => mock('read 2'), PRIORITY.READ)

    scheduleTask(() => mock('read 3'), PRIORITY.READ)
    scheduleTask(() => mock('compute 3'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('before render 3'), PRIORITY.BEFORE_RENDER)
    scheduleTask(() => mock('write 3'), PRIORITY.WRITE)

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(IDLE_DELAY)

    expect(mock).toHaveBeenCalledTimes(3)

    expect(mock).toHaveBeenNthCalledWith(1, 'before render 1')
    expect(mock).toHaveBeenNthCalledWith(2, 'before render 2')
    expect(mock).toHaveBeenNthCalledWith(3, 'before render 3')

    jest.advanceTimersByTime(FRAME_DELAY - IDLE_DELAY)

    expect(mock).toHaveBeenNthCalledWith(4, 'read 1')
    expect(mock).toHaveBeenNthCalledWith(5, 'read 2')
    expect(mock).toHaveBeenNthCalledWith(6, 'read 3')

    expect(mock).toHaveBeenNthCalledWith(7, 'compute 1')
    expect(mock).toHaveBeenNthCalledWith(8, 'compute 2')
    expect(mock).toHaveBeenNthCalledWith(9, 'compute 3')

    expect(mock).toHaveBeenNthCalledWith(10, 'write 1')
    expect(mock).toHaveBeenNthCalledWith(11, 'write 2')
    expect(mock).toHaveBeenNthCalledWith(12, 'write 3')

    expect(mock).toHaveBeenCalledTimes(12)

    scheduleTask(() => mock('write 4'), PRIORITY.WRITE)
    scheduleTask(() => mock('compute 4'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('read 4'), PRIORITY.READ)
    scheduleTask(() => mock('before render 4'), PRIORITY.BEFORE_RENDER)

    scheduleTask(() => mock('before render 5'), PRIORITY.BEFORE_RENDER)
    scheduleTask(() => mock('compute 5'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 5'), PRIORITY.WRITE)
    scheduleTask(() => mock('read 5'), PRIORITY.READ)

    scheduleTask(() => mock('read 6'), PRIORITY.READ)
    scheduleTask(() => mock('compute 6'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('before render 6'), PRIORITY.BEFORE_RENDER)
    scheduleTask(() => mock('write 6'), PRIORITY.WRITE)

    expect(mock).toHaveBeenCalledTimes(12)

    jest.advanceTimersByTime(IDLE_DELAY)

    expect(mock).toHaveBeenCalledTimes(15)

    expect(mock).toHaveBeenNthCalledWith(13, 'before render 4')
    expect(mock).toHaveBeenNthCalledWith(14, 'before render 5')
    expect(mock).toHaveBeenNthCalledWith(15, 'before render 6')

    jest.advanceTimersByTime(FRAME_DELAY - IDLE_DELAY)

    expect(mock).toHaveBeenNthCalledWith(16, 'read 4')
    expect(mock).toHaveBeenNthCalledWith(17, 'read 5')
    expect(mock).toHaveBeenNthCalledWith(18, 'read 6')

    expect(mock).toHaveBeenNthCalledWith(19, 'compute 4')
    expect(mock).toHaveBeenNthCalledWith(20, 'compute 5')
    expect(mock).toHaveBeenNthCalledWith(21, 'compute 6')

    expect(mock).toHaveBeenNthCalledWith(22, 'write 4')
    expect(mock).toHaveBeenNthCalledWith(23, 'write 5')
    expect(mock).toHaveBeenNthCalledWith(24, 'write 6')

    expect(mock).toHaveBeenCalledTimes(24)
  })

  it('cancels task', () => {
    const mock = jest.fn()

    const cancel1 = scheduleTask(() => mock('task 1'))
    const cancel2 = scheduleTask(() => mock('task 2'))
    const cancel3 = scheduleTask(() => mock('task 3'))
    cancel2()
    const cancel4 = scheduleTask(() => mock('task 4'))
    cancel4()

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_DELAY)

    expect(mock).toHaveBeenNthCalledWith(1, 'task 1')
    expect(mock).toHaveBeenNthCalledWith(2, 'task 3')

    expect(mock).toHaveBeenCalledTimes(2)

    scheduleTask(() => mock('task 5'))
    const cancel6 = scheduleTask(() => mock('task 6'))
    scheduleTask(() => mock('task 7'))
    scheduleTask(() => mock('task 8'))

    cancel6()
    cancel1()
    cancel3()
    cancel4()

    expect(mock).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(FRAME_DELAY)

    expect(mock).toHaveBeenNthCalledWith(3, 'task 5')
    expect(mock).toHaveBeenNthCalledWith(4, 'task 7')
    expect(mock).toHaveBeenNthCalledWith(5, 'task 8')

    expect(mock).toHaveBeenCalledTimes(5)
  })
})
