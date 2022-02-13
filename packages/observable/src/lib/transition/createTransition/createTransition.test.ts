import { assert } from '@pavel/assert'
import { Transition } from '../types'
import { createTransition } from './createTransition'

function createTimeUtils({ duration }: { duration: number }) {
  let currentFraction = 0

  function toTime(fraction: number) {
    return duration * fraction
  }

  return {
    setTimeProgress(newFraction: number) {
      assert(
        newFraction >= currentFraction,
        `Cannot move back in time. Previous time: ${toTime(
          currentFraction,
        )}, new time: ${toTime(newFraction)}`,
      )

      const timeDiff = toTime(newFraction) - toTime(currentFraction)

      jest.advanceTimersByTime(timeDiff)

      currentFraction = newFraction
    },
  }
}

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
    let setTimeProgress: ReturnType<typeof createTimeUtils>['setTimeProgress']

    beforeEach(() => {
      ;({ setTimeProgress } = createTimeUtils({ duration }))
      transition = createTransition({
        initialValue,
        duration,
      })
    })

    it('hasNewValue returns false', () => {
      expect(transition.hasNewValue()).toBe(false)
    })

    it('getCurrentValue returns initialValue', () => {
      expect(transition.getCurrentValue()).toBe(initialValue)
    })

    describe('when calling setTargetValue', () => {
      describe('with initial value', () => {
        beforeEach(() => {
          ;({ setTimeProgress } = createTimeUtils({ duration }))

          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(initialValue)
        })

        it('hasNewValue returns false', () => {
          expect(transition.hasNewValue()).toBe(false)
        })

        it('getCurrentValue returns initialValue', () => {
          expect(transition.getCurrentValue()).toBe(initialValue)
        })
      })

      describe('with current transition value', () => {
        const currentTransitionValue = 5

        beforeEach(() => {
          ;({ setTimeProgress } = createTimeUtils({ duration }))

          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(10)

          setTimeProgress(0.5)
        })

        describe('when value was not observed yet', () => {
          beforeEach(() => {
            // Should not call getCurrentValue here
            // as it changes the result of hasNewValue
            transition.setTargetValue(currentTransitionValue)
          })

          it('hasNewValue returns true', () => {
            expect(transition.hasNewValue()).toBe(true)
          })

          it('getCurrentValue returns current transition value and completed transition', () => {
            expect(transition.getCurrentValue()).toBe(currentTransitionValue)
            expect(transition.hasNewValue()).toBe(false)
          })
        })

        describe('when value was already observed', () => {
          beforeEach(() => {
            transition.getCurrentValue()

            // Should not call getCurrentValue here
            // as it changes the result of hasNewValue
            transition.setTargetValue(currentTransitionValue)
          })

          it('hasNewValue returns false', () => {
            expect(transition.hasNewValue()).toBe(false)
          })
        })
      })

      describe('with different value', () => {
        const newTargetValue = 10

        beforeEach(() => {
          ;({ setTimeProgress } = createTimeUtils({ duration }))

          // TODO: Make this default API?
          transition = createTransition({
            initialValue,
            duration,
          })
          transition.setTargetValue(newTargetValue)
        })

        it('hasNewValue returns true', () => {
          expect(transition.hasNewValue()).toBe(true)
        })

        it('transitions from initial value to target value', () => {
          expect(transition.hasNewValue()).toBe(true)
          expect(transition.getCurrentValue()).toBe(initialValue)
          expect(transition.hasNewValue()).toBe(true)

          setTimeProgress(0.1)

          expect(transition.hasNewValue()).toBe(true)
          expect(transition.getCurrentValue()).toBe(1)
          expect(transition.hasNewValue()).toBe(true)

          setTimeProgress(0.5)

          expect(transition.hasNewValue()).toBe(true)
          expect(transition.getCurrentValue()).toBe(5)
          expect(transition.hasNewValue()).toBe(true)

          setTimeProgress(0.7)

          expect(transition.hasNewValue()).toBe(true)
          expect(transition.getCurrentValue()).toBe(7)
          expect(transition.hasNewValue()).toBe(true)

          setTimeProgress(1)

          expect(transition.hasNewValue()).toBe(true)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasNewValue()).toBe(false)

          setTimeProgress(100)

          expect(transition.hasNewValue()).toBe(false)
          expect(transition.getCurrentValue()).toBe(10)
          expect(transition.hasNewValue()).toBe(false)
        })

        describe('when calling setTargetValue during the transition', () => {
          beforeEach(() => {
            setTimeProgress(0.5)

            transition.setTargetValue(15)
          })

          it('transitions from latest value to new target value', () => {
            expect(transition.hasNewValue()).toBe(true)
            expect(transition.getCurrentValue()).toBe(5)
            expect(transition.hasNewValue()).toBe(true)

            setTimeProgress(1)

            expect(transition.hasNewValue()).toBe(true)
            expect(transition.getCurrentValue()).toBe(10)
            expect(transition.hasNewValue()).toBe(true)

            setTimeProgress(1.1)

            expect(transition.hasNewValue()).toBe(true)
            expect(transition.getCurrentValue()).toBe(11)
            expect(transition.hasNewValue()).toBe(true)

            setTimeProgress(1.4)

            expect(transition.hasNewValue()).toBe(true)
            expect(transition.getCurrentValue()).toBe(14)
            expect(transition.hasNewValue()).toBe(true)

            setTimeProgress(1.5)

            expect(transition.hasNewValue()).toBe(true)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasNewValue()).toBe(false)

            setTimeProgress(10)

            expect(transition.hasNewValue()).toBe(false)
            expect(transition.getCurrentValue()).toBe(15)
            expect(transition.hasNewValue()).toBe(false)
          })
        })

        describe('when calling setOptions during transition', () => {
          describe('with different options', () => {
            const newDuration = 5

            beforeEach(() => {
              setTimeProgress(0.5)

              transition.setOptions({
                duration: newDuration,
              })
            })

            it('continues transition from the latest value to target value using new options', () => {
              expect(transition.hasNewValue()).toBe(true)
              expect(transition.getCurrentValue()).toBe(5)
              expect(transition.hasNewValue()).toBe(true)

              setTimeProgress(0.6)

              expect(transition.hasNewValue()).toBe(true)
              expect(transition.getCurrentValue()).toBe(6)
              expect(transition.hasNewValue()).toBe(true)

              setTimeProgress(0.7)

              expect(transition.hasNewValue()).toBe(true)
              expect(transition.getCurrentValue()).toBe(7)
              expect(transition.hasNewValue()).toBe(true)

              setTimeProgress(1)

              expect(transition.hasNewValue()).toBe(true)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasNewValue()).toBe(false)

              setTimeProgress(10)

              expect(transition.hasNewValue()).toBe(false)
              expect(transition.getCurrentValue()).toBe(10)
              expect(transition.hasNewValue()).toBe(false)
            })
          })
        })
      })
    })
  })
})
