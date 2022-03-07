export const ensure =
  <T>(predicate: (value: unknown) => boolean) =>
  (value: unknown): T => {
    if (predicate(value)) {
      return value as T
    }

    throw new Error(`Expected ${value} to satisfy predicate`)
  }
