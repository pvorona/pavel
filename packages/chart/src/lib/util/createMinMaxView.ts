import {
  computeLazy,
  observable,
  effect,
  ReadonlySubject,
  ReadonlyLazySubject,
} from '@pavel/observable'
import { InternalGraph } from '../types'
import { getMinMax } from './getMinMax'

export function createMinMaxView(
  startIndex: ReadonlyLazySubject<number>,
  endIndex: ReadonlyLazySubject<number>,
  enabledGraphKeys: ReadonlySubject<string[]>,
  graphs: readonly InternalGraph[],
  dataByGraphKey: { readonly [graphKey: string]: readonly number[] },
) {
  const minMaxByGraphKey = computeLazy(
    [startIndex, endIndex],
    (startIndex, endIndex) => {
      const result: { [graphKey: string]: { min: number; max: number } } = {}

      for (let i = 0; i < graphs.length; i++) {
        const { key } = graphs[i]

        result[key] = getMinMax(startIndex, endIndex, dataByGraphKey[key])
      }

      return result
    },
  )

  const max = computeLazy(
    [minMaxByGraphKey, enabledGraphKeys],
    (minMaxByGraphKey, enabledGraphKeys) => {
      if (enabledGraphKeys.length === 0) {
        return prevVisibleMax.get()
      }

      let result = -Infinity

      for (const graphKey of enabledGraphKeys) {
        result = Math.max(result, minMaxByGraphKey[graphKey].max)
      }

      return result
    },
  )

  const min = computeLazy(
    [minMaxByGraphKey, enabledGraphKeys],
    (minMaxByGraphKey, enabledGraphKeys) => {
      if (enabledGraphKeys.length === 0) {
        return prevVisibleMin.get()
      }

      let result = +Infinity

      for (const graphKey of enabledGraphKeys) {
        result = Math.min(result, minMaxByGraphKey[graphKey].min)
      }

      return result
    },
  )

  const prevVisibleMax = observable(+Infinity)

  effect([max], visibleMax => {
    prevVisibleMax.set(visibleMax)
  })

  const prevVisibleMin = observable(-Infinity)

  effect([min], visibleMin => {
    prevVisibleMin.set(visibleMin)
  })

  return { minMaxByGraphKey, min, max }
}
