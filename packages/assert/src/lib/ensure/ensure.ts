export const ensure =
  <T>(...predicates: ((value: unknown) => boolean)[]) =>
  (value: unknown, identifier?: string): T => {
    for (const predicate of predicates) {
      if (!predicate(value)) {
        throw new Error(
          `Expected ${value} to satisfy predicate${
            identifier ? ` when evaluating ${identifier}` : ''
          }`,
        )
      }
    }

    return value as T
  }
