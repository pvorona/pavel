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

    it('hasPendingObservation returns false', () => {
      expect(transition.hasPendingObservation()).toBe(false)
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

        it('hasPendingObservation returns false', () => {
          expect(transition.hasPendingObservation()).toBe(false)
        })

        it('getCurrentValue returns initialValue', () => {
          expect(transition.getCurrentValue()).toBe(initialValue)
        })
      })

      describe('with current transition value', () => {
        const currentTransitionValue = 5

        beforeEach(() => {
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(10)

          jest.advanceTimersByTime(5)

          // Should not call getCurrentValue here 
          // as it changes the result of hasPendingObservation
          transition.setTargetValue(currentTransitionValue)
        })

        describe('when value was not observed yet', () => {
          it('hasPendingObservation returns true', () => {
            expect(transition.hasPendingObservation()).toBe(true)
          })

          it('getCurrentValue returns current transition value and completed transition', () => {
            expect(transition.getCurrentValue()).toBe(currentTransitionValue)
            expect(transition.hasPendingObservation()).toBe(false)
          })
        })

        describe('when value was already observed', () => {
          beforeEach(() => {
            transition.getCurrentValue()
          })

          it('hasPendingObservation returns false', () => {
            expect(transition.hasPendingObservation()).toBe(false)
          })
        })
      })

      describe('with different value', () => {
        const newTargetValue = 10

        beforeEach(() => {
          // TODO: Make this default API?
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(newTargetValue)
        })

        it('hasPendingObservation returns true', () => {
          expect(transition.hasPendingObservation()).toBe(true)
        })

        it('transitions from initial value to target value', () => {
          expect(transition.hasPendingObservation()).toBe(true)
          expect(transition.getCurrentValue()).toBe(initialValue)
          expect(transition.hasPendingObservation()).toBe(true)

          jest.advanceTimersByTime(1)

          expect(transition.hasPendingObservation()).toBe(true)
          expect(transition.getCurrentValue()).toBe(1)
          expect(transition.hasPendingObservation()).toBe(true)

          jest.advanceTimersByTime(4)

          expect(transition.hasPendingObservation()).toBe(true)
          expect(transition.getCurrentValue()).toBe(5)
          expect(transition.hasPendingObservation()).toBe(true)

          jest.advanceTimersByTime(2)

          expect(transition.hasPendingObservation()).toBe(true)
          expect(transition.getCurrentValue()).toBe(7)
          expect(transition.hasPendingObservation()).toBe(true)

          jest.advanceTimersByTime(3)

          expect(transition.hasPendingObservation()).toBe(true)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasPendingObservation()).toBe(false)

          jest.advanceTimersByTime(100)

          expect(transition.hasPendingObservation()).toBe(false)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasPendingObservation()).toBe(false)
        })

        describe('when calling setTargetValue during the transition', () => {
          beforeEach(() => {
            jest.advanceTimersByTime(5)

            transition.setTargetValue(15)
          })

          it('transitions from latest value to new target value', () => {
            expect(transition.hasPendingObservation()).toBe(true)
            expect(transition.getCurrentValue()).toBe(5)
            expect(transition.hasPendingObservation()).toBe(true)

            jest.advanceTimersByTime(5)

            expect(transition.hasPendingObservation()).toBe(true)
            expect(transition.getCurrentValue()).toBe(10)
            expect(transition.hasPendingObservation()).toBe(true)

            jest.advanceTimersByTime(1)

            expect(transition.hasPendingObservation()).toBe(true)
            expect(transition.getCurrentValue()).toBe(11)
            expect(transition.hasPendingObservation()).toBe(true)

            jest.advanceTimersByTime(3)

            expect(transition.hasPendingObservation()).toBe(true)
            expect(transition.getCurrentValue()).toBe(14)
            expect(transition.hasPendingObservation()).toBe(true)

            jest.advanceTimersByTime(1)

            expect(transition.hasPendingObservation()).toBe(true)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasPendingObservation()).toBe(false)

            jest.advanceTimersByTime(100)

            expect(transition.hasPendingObservation()).toBe(false)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasPendingObservation()).toBe(false)
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
              expect(transition.hasPendingObservation()).toBe(true)
              expect(transition.getCurrentValue()).toBe(5)
              expect(transition.hasPendingObservation()).toBe(true)

              jest.advanceTimersByTime(1)

              expect(transition.hasPendingObservation()).toBe(true)
              expect(transition.getCurrentValue()).toBe(6)
              expect(transition.hasPendingObservation()).toBe(true)

              jest.advanceTimersByTime(1)

              expect(transition.hasPendingObservation()).toBe(true)
              expect(transition.getCurrentValue()).toBe(7)
              expect(transition.hasPendingObservation()).toBe(true)

              jest.advanceTimersByTime(3)

              expect(transition.hasPendingObservation()).toBe(true)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasPendingObservation()).toBe(false)

              jest.advanceTimersByTime(100)

              expect(transition.hasPendingObservation()).toBe(false)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasPendingObservation()).toBe(false)
            })
          })
        })
      })
    })
  })
})
