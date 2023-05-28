export function ensureNever(
  value: never,
  message = `Expected value ${value} to be never`,
): never {
  throw new Error(message)
}
