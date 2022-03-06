// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function>(value: unknown): value is T {
  return typeof value === 'function'
}
