import { assert } from './assert'

describe('assert', () => {
  describe('when condition is false', () => {
    it('throws', () => {
      const TEST_MESSAGE = 'TEST_MESSAGE'

      expect(() => assert(false, TEST_MESSAGE)).toThrow(TEST_MESSAGE)
    })
  })

  describe('when condition is true', () => {
    it("doesn't throw", () => {
      const TEST_MESSAGE = 'TEST_MESSAGE'

      expect(() => assert(true, TEST_MESSAGE)).not.toThrow()
    })
  })
})
