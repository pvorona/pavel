import { Gettable, ObservedTypesOf } from '../../types'

export function collectValues<T extends Gettable<unknown>[]>(
  sources: readonly [...T],
): ObservedTypesOf<T>
export function collectValues(sources: readonly Gettable<unknown>[]) {
  const values = new Array(sources.length)

  for (let i = 0; i < sources.length; i++) {
    values[i] = sources[i].get()
  }

  return values
}
