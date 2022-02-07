import { observable } from '../../observable'
import { collectValues } from './collectValues'

describe('with eager observables', () => {
  it.each([
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7],
  ])('collects latest values from observables', (...values) => {
    const observables = values.map(observable)

    expect(collectValues(observables)).toStrictEqual(values)
  })
})
