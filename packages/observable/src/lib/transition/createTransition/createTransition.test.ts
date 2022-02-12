import { Transition } from '../types'
import { createTransition } from './createTransition'

describe('createTransition', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  describe('when initialized with negative duration', () => {
    const initialValue = 0
    const duration = -1

    it('throws error', () => {
      expect(() =>
        createTransition({
          initialValue,
          duration,
        }),
      ).toThrowError(`Expected positive duration. Received ${duration}`)
    })
  })

  describe('when initialized with non-negative duration', () => {
    const initialValue = 0
    const duration = 10

    let transition: Transition<number>

    beforeEach(() => {
      transition = createTransition({
        initialValue,
        duration,
      })
    })

    it('hasCompleted returns true', () => {
      expect(transition.hasCompleted()).toBe(true)
    })

    it('getCurrentValue returns initialValue', () => {
      expect(transition.getCurrentValue()).toBe(initialValue)
    })

    describe('when calling setTargetValue', () => {
      describe('with initial value', () => {
        beforeEach(() => {
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(initialValue)
        })

        it('hasCompleted returns true', () => {
          expect(transition.hasCompleted()).toBe(true)
        })

        it('getCurrentValue returns initialValue', () => {
          expect(transition.getCurrentValue()).toBe(initialValue)
        })
      })

      // What if last value was not observed?
      describe('with current transition value', () => {
        const currentTransitionValue = 5

        beforeEach(() => {
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(10)

          jest.advanceTimersByTime(5)

          transition.setTargetValue(currentTransitionValue)
        })

        it('hasCompleted returns true', () => {
          expect(transition.hasCompleted()).toBe(true)
        })

        it('getCurrentValue returns current transition value', () => {
          expect(transition.getCurrentValue()).toBe(currentTransitionValue)
        })
      })

      describe('with different value', () => {
        const newTargetValue = 10

        beforeEach(() => {
          // Make this default API?
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(newTargetValue)
        })

        it('hasCompleted returns false', () => {
          expect(transition.hasCompleted()).toBe(false)
        })

        it('transitions from initial value to target value', () => {
          expect(transition.hasCompleted()).toBe(false)
          expect(transition.getCurrentValue()).toBe(initialValue)
          expect(transition.hasCompleted()).toBe(false)

          jest.advanceTimersByTime(1)

          expect(transition.hasCompleted()).toBe(false)
          expect(transition.getCurrentValue()).toBe(1)
          expect(transition.hasCompleted()).toBe(false)

          jest.advanceTimersByTime(4)

          expect(transition.hasCompleted()).toBe(false)
          expect(transition.getCurrentValue()).toBe(5)
          expect(transition.hasCompleted()).toBe(false)

          jest.advanceTimersByTime(2)

          expect(transition.hasCompleted()).toBe(false)
          expect(transition.getCurrentValue()).toBe(7)
          expect(transition.hasCompleted()).toBe(false)

          jest.advanceTimersByTime(3)

          expect(transition.hasCompleted()).toBe(false)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasCompleted()).toBe(true)

          jest.advanceTimersByTime(100)

          expect(transition.hasCompleted()).toBe(true)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasCompleted()).toBe(true)
        })

        describe('when calling setTargetValue during the transition', () => {
          beforeEach(() => {
            jest.advanceTimersByTime(5)

            transition.setTargetValue(15)
          })

          it('transitions from latest value to new target value', () => {
            expect(transition.hasCompleted()).toBe(false)
            expect(transition.getCurrentValue()).toBe(5)
            expect(transition.hasCompleted()).toBe(false)

            jest.advanceTimersByTime(5)

            expect(transition.hasCompleted()).toBe(false)
            expect(transition.getCurrentValue()).toBe(10)
            expect(transition.hasCompleted()).toBe(false)

            jest.advanceTimersByTime(1)

            expect(transition.hasCompleted()).toBe(false)
            expect(transition.getCurrentValue()).toBe(11)
            expect(transition.hasCompleted()).toBe(false)

            jest.advanceTimersByTime(3)

            expect(transition.hasCompleted()).toBe(false)
            expect(transition.getCurrentValue()).toBe(14)
            expect(transition.hasCompleted()).toBe(false)

            jest.advanceTimersByTime(1)

            // TODO: hasCompleted -> hasObservedTargetValue?
            expect(transition.hasCompleted()).toBe(false)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasCompleted()).toBe(true)

            jest.advanceTimersByTime(100)

            expect(transition.hasCompleted()).toBe(true)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasCompleted()).toBe(true)
          })
        })

        describe('when calling setOptions during transition', () => {
          describe('with different options', () => {
            const newDuration = 5

            beforeEach(() => {
              jest.advanceTimersByTime(5)

              transition.setOptions({
                duration: newDuration,
              })
            })

            it('continues transition from the latest value to target value using new options', () => {
              expect(transition.hasCompleted()).toBe(false)
              expect(transition.getCurrentValue()).toBe(5)
              expect(transition.hasCompleted()).toBe(false)

              jest.advanceTimersByTime(1)

              expect(transition.hasCompleted()).toBe(false)
              expect(transition.getCurrentValue()).toBe(6)
              expect(transition.hasCompleted()).toBe(false)

              jest.advanceTimersByTime(1)

              expect(transition.hasCompleted()).toBe(false)
              expect(transition.getCurrentValue()).toBe(7)
              expect(transition.hasCompleted()).toBe(false)

              jest.advanceTimersByTime(3)

              expect(transition.hasCompleted()).toBe(false)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasCompleted()).toBe(true)

              jest.advanceTimersByTime(100)

              expect(transition.hasCompleted()).toBe(true)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasCompleted()).toBe(true)
            })
          })
        })
      })
    })
  })
})
