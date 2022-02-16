export function getValue<T>(
  newValueOrFactory: T | ((prevValue: T) => T),
  currentValue: T,
): T {
  return newValueOrFactory instanceof Function
    ? newValueOrFactory(currentValue)
    : newValueOrFactory
}
