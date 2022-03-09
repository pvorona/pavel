import {
  computeLazy,
  observable,
  effect,
  EagerSubject,
  ReadonlySubject,
} from '@pavel/observable'
import { getMinMax } from './getMinMax'

export function createMinMaxView(
  startIndex: EagerSubject<number>,
  endIndex: EagerSubject<number>,
  enabledGraphNames: ReadonlySubject<string[]>,
  dataByGraphName: { [graphName: string]: number[] },
) {
  const minMaxByGraphName = computeLazy(
    // should be all graph names, not only enabled
    [startIndex, endIndex, enabledGraphNames],
    (startIndex, endIndex, enabledGraphNames) => {
      const result: { [graphName: string]: { min: number; max: number } } = {}

      for (let i = 0; i < enabledGraphNames.length; i++) {
        const graphName = enabledGraphNames[i]

        result[graphName] = getMinMax(
          startIndex,
          endIndex,
          dataByGraphName[graphName],
        )
      }

      return result
    },
  )

  const max = computeLazy(
    [minMaxByGraphName, enabledGraphNames],
    (visibleMinMaxByGraphName, enabledGraphNames) => {
      if (enabledGraphNames.length === 0) return prevVisibleMax.value

      let result = -Infinity

      for (const graphName of enabledGraphNames) {
        result = Math.max(result, visibleMinMaxByGraphName[graphName].max)
      }

      return result
    },
  )

  const min = computeLazy(
    [minMaxByGraphName, enabledGraphNames],
    (visibleMinMaxByGraphName, enabledGraphNames) => {
      if (enabledGraphNames.length === 0) return prevVisibleMin.value

      let result = +Infinity

      for (const graphName of enabledGraphNames) {
        result = Math.min(result, visibleMinMaxByGraphName[graphName].min)
      }

      return result
    },
  )

  const prevVisibleMax = observable(+Infinity)

  effect([max], visibleMax => {
    prevVisibleMax.value = visibleMax
  })

  const prevVisibleMin = observable(-Infinity)

  effect([min], visibleMin => {
    prevVisibleMin.value = visibleMin
  })

  return { minMaxByGraphName, min, max }
}
