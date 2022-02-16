import { Lambda } from '@pavel/types'
import { removeFirstElementOccurrence } from '.'

export function pushWithCleanup<T>(array: T[], item: T): Lambda {
  array.push(item)

  return () => {
    removeFirstElementOccurrence(array, item)
  }
}
