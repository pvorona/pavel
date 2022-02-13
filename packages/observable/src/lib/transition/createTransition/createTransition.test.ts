import { TransitionV4 } from '../types'
import { createTransition } from './createTransition'
import { createTimeUtils } from './__test__/createTimeUtils'

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

    let transition: TransitionV4<number>
    let setTimeProgress: ReturnType<typeof createTimeUtils>['setTimeProgress']

    beforeEach(() => {
      ;({ setTimeProgress } = createTimeUtils({ duration }))
      transition = createTransition({
        initialValue,
        duration,
      })
    })

    it('getCurrentValue returns { value: initialValue, hasCompleted: true }', () => {
      expect(transition.getCurrentValue()).toStrictEqual({
        value: initialValue,
        hasCompleted: true,
      })
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

        it('getCurrentValue returns { value: initialValue, hasCompleted: true }', () => {
          expect(transition.getCurrentValue()).toStrictEqual({
            value: initialValue,
            hasCompleted: true,
          })
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

          it('getCurrentValue returns { value: currentTransitionValue, hasCompleted: true }', () => {
            expect(transition.getCurrentValue()).toStrictEqual({
              value: currentTransitionValue,
              hasCompleted: true,
            })
          })
        })

        describe('when value was already observed', () => {
          beforeEach(() => {
            // Observe latest value
            transition.getCurrentValue()
          })

          it('returns { hasCompleted: true }', () => {
            // Should not call getCurrentValue here
            // as it changes the result of hasNewValue
            expect(
              transition.setTargetValue(currentTransitionValue),
            ).toStrictEqual({ hasCompleted: true })
          })
        })
      })

      describe('with different value', () => {
        const newTargetValue = 10

        beforeEach(() => {
          ;({ setTimeProgress } = createTimeUtils({ duration }))

          transition = createTransition({
            initialValue,
            duration,
          })
        })

        it('returns { hasCompleted: true } and transitions from initial value to target value', () => {
          expect(transition.setTargetValue(newTargetValue)).toStrictEqual({
            hasCompleted: false,
          })

          expect(transition.getCurrentValue()).toStrictEqual({
            value: initialValue,
            hasCompleted: false,
          })

          setTimeProgress(0.1)

          expect(transition.getCurrentValue()).toStrictEqual({
            value: 1,
            hasCompleted: false,
          })

          setTimeProgress(0.5)

          expect(transition.getCurrentValue()).toStrictEqual({
            value: 5,
            hasCompleted: false,
          })

          setTimeProgress(0.7)

          expect(transition.getCurrentValue()).toStrictEqual({
            value: 7,
            hasCompleted: false,
          })

          setTimeProgress(1)

          expect(transition.getCurrentValue()).toStrictEqual({
            value: 10,
            hasCompleted: true,
          })

          setTimeProgress(100)

          expect(transition.getCurrentValue()).toStrictEqual({
            value: 10,
            hasCompleted: true,
          })
        })

        describe('when calling setTargetValue during the transition', () => {
          beforeEach(() => {
            setTimeProgress(0.5)
          })

          it('returns { hasCompleted: false } and transitions from latest value to new target value', () => {
            expect(transition.setTargetValue(15)).toStrictEqual({
              hasCompleted: false,
            })

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 5,
              hasCompleted: false,
            })

            setTimeProgress(1)

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 10,
              hasCompleted: false,
            })

            setTimeProgress(1.1)

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 11,
              hasCompleted: false,
            })

            setTimeProgress(1.4)

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 14,
              hasCompleted: false,
            })

            setTimeProgress(1.5)

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 15,
              hasCompleted: true,
            })

            setTimeProgress(10)

            expect(transition.getCurrentValue()).toStrictEqual({
              value: 15,
              hasCompleted: true,
            })
          })
        })

        describe('when calling setOptions during transition', () => {
          describe('with different options', () => {
            const newDuration = 5

            beforeEach(() => {
              setTimeProgress(0.5)
            })

            it('continues transition from the latest value to target value using new options', () => {
              expect(transition.setOptions({
                duration: newDuration,
              })).toStrictEqual({ hasCompleted: false })

              
              expect(transition.getCurrentValue()).toStrictEqual({
                value: 5,
                hasCompleted: false,
              })

              setTimeProgress(0.6)

              expect(transition.getCurrentValue()).toStrictEqual({
                value: 6,
                hasCompleted: false,
              })

              setTimeProgress(0.7)

              expect(transition.getCurrentValue()).toStrictEqual({
                value: 7,
                hasCompleted: false,
              })

              setTimeProgress(1)

              expect(transition.getCurrentValue()).toStrictEqual({
                value: 10,
                hasCompleted: true,
              })

              setTimeProgress(10)

              expect(transition.getCurrentValue()).toStrictEqual({
                value: 10,
                hasCompleted: true,
              })
            })
          })
        })
      })
    })
  })
})
