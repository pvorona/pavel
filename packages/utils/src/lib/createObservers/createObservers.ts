import { Lambda } from '@pavel/types'
import { invokeAll } from '../invokeAll'
import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'

// Todo
// [] Lift type param
export function createObservers<T extends (...args: never[]) => void>() {
  const observers: T[] = []

  function addObserver(observer: T): Lambda {
    observers.push(observer)

    return () => {
      removeFirstElementOccurrence(observers, observer)
    }
  }

  function notify(...args: Parameters<T>) {
    invokeAll(observers, ...args)
  }

  return { register: addObserver, notify }
}
