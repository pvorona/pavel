import { assert } from '@pavel/assert'

export function createTimeUtils({ duration }: { duration: number }) {
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
