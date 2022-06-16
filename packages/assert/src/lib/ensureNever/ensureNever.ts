export function ensureNever(value: never): never {
  throw new Error(`Expected value ${value} to be never`)
}
