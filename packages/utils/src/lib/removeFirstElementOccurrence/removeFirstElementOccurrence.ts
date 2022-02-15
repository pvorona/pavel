export function removeFirstElementOccurrence<T>(array: T[], element: T) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      array.splice(i, 1)
      return
    }
  }
}
