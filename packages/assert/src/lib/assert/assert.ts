export const DEFAULT_MESSAGE = 'Assertion Error'

export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || DEFAULT_MESSAGE)
  }
}
