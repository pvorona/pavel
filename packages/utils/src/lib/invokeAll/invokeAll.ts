export function invokeAll<
  T extends unknown[] = never[],
  F extends (...args: T) => void = (...args: T) => void,
>(listeners: Iterable<F>, ...values: T): void {
  for (const listener of listeners) {
    listener(...values)
  }
}
