import { ReadableValue, ObservedTypesOf } from '../../types'

export function collectValues<T extends ReadableValue<unknown>[]>(
  sources: readonly [...T],
): ObservedTypesOf<T>
export function collectValues(sources: readonly ReadableValue<unknown>[]) {
  const values = []

  for (let i = 0; i < sources.length; i++) {
    values.push(sources[i].value)
  }

  return values
}
