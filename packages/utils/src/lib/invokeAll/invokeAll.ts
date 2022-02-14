export function invokeAll<T extends (...args: never[]) => void>(
  listeners: T[],
  ...values: Parameters<T>
): void {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i](...values)
  }
}
