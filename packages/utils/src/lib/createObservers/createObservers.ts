import { createLinkedList } from '../LinkedList'
import { Lambda } from '@pavel/types'

export function createObservers<
  T extends unknown[] = never[],
  F extends (...args: T) => void = (...args: T) => void,
>() {
  const observers = createLinkedList<F>()

  function register(observer: F): Lambda {
    const node = observers.append(observer)

    return () => {
      observers.removeNode(node)
    }
  }

  function notify(...args: Parameters<F>) {
    for (const observer of observers) {
      observer(...args)
    }
  }

  return { register, notify }
}
