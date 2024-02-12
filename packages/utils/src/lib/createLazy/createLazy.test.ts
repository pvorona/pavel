import { createLazy } from './createLazy'

describe('lazy', () => {
  const RESULT_1 = 1
  const RESULT_2 = 2
  const compute = jest.fn(() => RESULT_1)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("doesn't call compute until get is called, caches the result and recomputes again when notifyChanged is called", () => {
    const instance = createLazy(compute)

    expect(compute).not.toHaveBeenCalled()

    expect(instance.get()).toBe(RESULT_1)
    expect(instance.get()).toBe(RESULT_1)
    expect(instance.get()).toBe(RESULT_1)

    expect(compute).toHaveBeenCalledTimes(1)

    instance.notifyChanged()

    expect(compute).toHaveBeenCalledTimes(1)

    compute.mockReturnValue(RESULT_2)

    expect(instance.get()).toBe(RESULT_2)
    expect(instance.get()).toBe(RESULT_2)
    expect(instance.get()).toBe(RESULT_2)

    expect(compute).toHaveBeenCalledTimes(2)
  })
})
