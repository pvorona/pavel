import { removeFirstElementOccurrence } from './removeFirstElementOccurrence'

it('does not modify the array if it has no required element', () => {
  const initialArray = [1, 2, 3, 4, 5]
  const modifiedArray = [...initialArray]

  removeFirstElementOccurrence(modifiedArray, 0)

  expect(modifiedArray).toStrictEqual(initialArray)
})

it('removes all the copies of required element', () => {
  const initialArray = [1, 2, 3, 4, 5, 1, 2, 1]

  removeFirstElementOccurrence(initialArray, 1)

  expect(initialArray).toStrictEqual([2, 3, 4, 5, 1, 2, 1])
})
