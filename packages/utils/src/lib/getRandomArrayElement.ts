export function getRandomArrayElement<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)]
}
