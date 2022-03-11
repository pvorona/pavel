import { Lambda } from '@pavel/types'
import { invokeAll } from '../invokeAll'
import { removeFirstElementOccurrence } from '../removeFirstElementOccurrence'

export function createObservers<
  T extends unknown[] = never[],
  F extends (...args: T) => void = (...args: T) => void,
>() {
  // LinkedList works better here
  const observers: F[] = []

  function addObserver(observer: F): Lambda {
    observers.push(observer)

    return () => {
      removeFirstElementOccurrence(observers, observer)
    }
  }

  function notify(...args: Parameters<F>) {
    invokeAll(observers, ...args)
  }

  return { register: addObserver, notify }
}
