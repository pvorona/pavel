export function invokeAll<
  T extends unknown[] = never[],
  F extends (...args: T) => void = (...args: T) => void,
>(listeners: F[], ...values: T): void {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i](...values)
  }
}
