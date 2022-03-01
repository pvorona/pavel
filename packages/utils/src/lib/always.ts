export function always<T>(value: T): () => T {
  return function bound() {
    return value
  }
}
