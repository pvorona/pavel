import { Lambda } from '..'

export function notifyAll(listeners: Lambda[]): void {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i]()
  }
}

export function notifyAllWithValue<T>(
  listeners: ((value: T) => void)[],
  value: T,
): void {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i](value)
  }
}
