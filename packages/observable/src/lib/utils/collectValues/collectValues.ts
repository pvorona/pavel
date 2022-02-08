import { Gettable, ObservedTypesOf } from '../../types'

export function collectValues<T extends Gettable<unknown>[]>(
  sources: readonly [...T],
): ObservedTypesOf<T>
export function collectValues(sources: readonly Gettable<unknown>[]) {
  const values = []

  for (let i = 0; i < sources.length; i++) {
    values.push(sources[i].get())
  }

  return values
}
