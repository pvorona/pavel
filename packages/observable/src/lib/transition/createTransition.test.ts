import { createTransitionV2 } from './createTransition'

const FrameInterval = 100
const TransitionDuration = FrameInterval * 10

function useFakeRequestAnimationFrame(frameInterval: number) {
  let frameIndex = 1

  window.requestAnimationFrame = (callback: (n: number) => void) => {
    setTimeout(() => callback(0), frameInterval)

    return frameIndex++
  }
}

describe('createTransition', () => {
  const onTick = jest.fn()

  beforeAll(() => {
    jest.useFakeTimers()
    useFakeRequestAnimationFrame(FrameInterval)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when duration is negative', () => {
    it('throws', () => {
      expect(() =>
        createTransitionV2({
          duration: -1,
          initialValue: 0,
          targetValue: 10,
          onTick,
        }),
      ).toThrowError(`Expected positive duration. Received -1`)

      expect(onTick).not.toHaveBeenCalled()
      expect(jest.getTimerCount()).toStrictEqual(0)
    })
  })

  describe('when duration is 0', () => {
    it('instantly ticks with targetValue', () => {
      createTransitionV2({
        duration: 0,
        initialValue: 0,
        targetValue: 10,
        onTick,
      })

      expect(onTick).toHaveBeenLastCalledWith(10)
      expect(onTick).toHaveBeenCalledTimes(1)
      expect(jest.getTimerCount()).toStrictEqual(0)
    })
  })

  describe('with numbers', () => {
    describe('when initialValue === targetValue', () => {
      it('never ticks', () => {
        createTransitionV2({
          duration: TransitionDuration,
          initialValue: 0,
          targetValue: 0,
          onTick,
        })

        expect(onTick).not.toHaveBeenCalled()
        expect(jest.getTimerCount()).toStrictEqual(0)
      })
    })

    describe('when initialValue !== targetValue', () => {
      describe('and easing is NOT provided', () => {
        it('ticks with intermediate values using linear easing', () => {
          createTransitionV2({
            duration: 10 * FrameInterval,
            initialValue: 0,
            targetValue: 10,
            onTick,
          })

          for (let i = 0; i < 10; i++) {
            expect(jest.getTimerCount()).toStrictEqual(1)

            jest.advanceTimersToNextTimer()

            expect(onTick).toHaveBeenLastCalledWith(i + 1)
            expect(onTick).toHaveBeenCalledTimes(i + 1)
          }

          expect(jest.getTimerCount()).toStrictEqual(0)
        })
      })

      describe('and easing is provided', () => {
        it.todo('ticks with intermediate values using provided easing')
      })

      describe('when stopped', () => {
        it('never ticks', () => {
          const transition = createTransitionV2({
            duration: 10 * FrameInterval,
            initialValue: 0,
            targetValue: 10,
            onTick,
          })

          transition.stop()

          jest.advanceTimersToNextTimer()

          expect(onTick).not.toHaveBeenCalled()
          expect(jest.getTimerCount()).toStrictEqual(0)
        })

        it('returns the last actual value', () => {
          const transition = createTransitionV2({
            duration: 10 * FrameInterval,
            initialValue: 0,
            targetValue: 10,
            onTick,
          })

          jest.advanceTimersByTime(FrameInterval * 0.5)

          expect(transition.stop()).toStrictEqual(0.5)

          jest.advanceTimersByTime(FrameInterval * 0.5)

          expect(onTick).not.toHaveBeenCalled()
          expect(jest.getTimerCount()).toStrictEqual(0)
        })

        it.todo('cancels animation frame if the last task is cancelled')
      })
    })
  })
})
