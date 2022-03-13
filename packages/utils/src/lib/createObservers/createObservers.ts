import { createLinkedList } from '../LinkedList'
import { Lambda } from '@pavel/types'
import { invokeAll } from '../invokeAll'

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
    invokeAll(observers, ...args)
  }

  return { register, notify }
}
