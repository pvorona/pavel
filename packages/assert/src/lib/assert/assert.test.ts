import { assert, DEFAULT_MESSAGE } from './assert'

describe('Default assertion message', () => {
  it("is 'Assertion Error'", () => {
    expect(DEFAULT_MESSAGE).toBe('Assertion Error')
  })
})

describe('assert', () => {
  describe('when condition is false', () => {
    describe('and message is specified', () => {
      it('throws error with specified message', () => {
        const TEST_MESSAGE = 'TEST_MESSAGE'

        expect(() => assert(false, TEST_MESSAGE)).toThrow(TEST_MESSAGE)
      })
    })

    describe('and message is not specified', () => {
      it('throws error with default message', () => {
        expect(() => assert(false)).toThrow(DEFAULT_MESSAGE)
      })
    })
  })

  describe('when condition is true', () => {
    describe('and message is specified', () => {
      it("doesn't throw", () => {
        const TEST_MESSAGE = 'TEST_MESSAGE'

        expect(() => assert(true, TEST_MESSAGE)).not.toThrow()
      })
    })

    describe('and message is not specified', () => {
      it("doesn't throw", () => {
        expect(() => assert(true)).not.toThrow()
      })
    })
  })
})
