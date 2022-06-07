import { assertNever } from '@pavel/assert'
import {
  computeLazy,
  observable,
  effect,
  ReadonlySubject,
  ReadonlyLazySubject,
} from '@pavel/observable'
import { InternalGraph, InternalMarker } from '../types'
import { getMinMax } from './getMinMax'

const INVISIBLE_MARKER_MIN_MAX = { max: -Infinity, min: +Infinity } as const

export function createMinMaxView(
  startX: ReadonlySubject<number>,
  endX: ReadonlySubject<number>,
  startIndex: ReadonlyLazySubject<number>,
  endIndex: ReadonlyLazySubject<number>,
  enabledStateByGraphKey: ReadonlySubject<Record<string, boolean>>,
  graphs: readonly InternalGraph[],
  dataByGraphKey: { readonly [graphKey: string]: readonly number[] },
  markers: readonly InternalMarker[],
  enabledMarkerIndexes: ReadonlySubject<Record<number, boolean>>,
) {
  const minMaxByGraphKey = computeLazy(
    [startIndex, endIndex, enabledStateByGraphKey],
    (startIndex, endIndex, enabledGraphKeys) => {
      const result: { [graphKey: string]: { min: number; max: number } } = {}

      for (let i = 0; i < graphs.length; i++) {
        const { key } = graphs[i]

        if (enabledGraphKeys[key]) {
          result[key] = getMinMax(startIndex, endIndex, dataByGraphKey[key])

          continue
        }

        result[key] = INVISIBLE_MARKER_MIN_MAX
      }

      return result
    },
  )

  const minMaxMarkers = computeLazy(
    [startX, endX, startIndex, endIndex, enabledMarkerIndexes],
    (startX, endX, startIndex, endIndex, enabledMarkerIndexes) => {
      let currentMin = +Infinity
      let currentMax = -Infinity

      for (let index = 0; index < markers.length; index++) {
        const marker = markers[index]

        const minMax = getMarkerMinMax(
          startX,
          endX,
          startIndex,
          endIndex,
          marker,
          index,
          enabledMarkerIndexes,
        )

        currentMin = Math.min(currentMin, minMax.min)
        currentMax = Math.max(currentMax, minMax.max)
      }

      return { min: currentMin, max: currentMax }
    },
  )

  const minMax = computeLazy(
    [minMaxByGraphKey, minMaxMarkers],
    (minMaxByGraphKey, minMaxMarkers) => {
      let currentMin = +Infinity
      let currentMax = -Infinity

      for (let index = 0; index < graphs.length; index++) {
        const { key } = graphs[index]
        const graphMinMax = minMaxByGraphKey[key]

        currentMin = Math.min(currentMin, graphMinMax.min)
        currentMax = Math.max(currentMax, graphMinMax.max)
      }

      currentMin = Math.min(currentMin, minMaxMarkers.min)
      currentMax = Math.max(currentMax, minMaxMarkers.max)

      if (currentMin === +Infinity && currentMax === -Infinity) {
        return prevMinMax.get()
      }

      return { min: currentMin, max: currentMax }
    },
  )

  const min = computeLazy([minMax], ({ min }) => min)

  const max = computeLazy([minMax], ({ max }) => max)

  const prevMinMax = observable({
    min: +Infinity,
    max: -Infinity,
  })

  effect([minMax], prevMinMax.set)

  return { minMaxByGraphKey, min, max }
}

function getMarkerMinMax(
  startX: number,
  endX: number,
  startIndex: number,
  endIndex: number,
  marker: InternalMarker,
  groupIndex: number,
  enabledMarkerIndexes: Record<number, boolean>,
): { min: number; max: number } {
  if (marker.type === 'x') {
    return INVISIBLE_MARKER_MIN_MAX
  }

  if (marker.type === 'y') {
    return { max: marker.y, min: marker.y }
  }

  if (marker.type === 'rect') {
    const isVisible = !(marker.x > endX || marker.x + marker.width < startX)

    if (!isVisible) {
      return INVISIBLE_MARKER_MIN_MAX
    }

    return { max: marker.y, min: marker.y + marker.height }
  }

  if (marker.type === 'flow') {
    const minMaxLine1 = getMinMax(
      startIndex,
      endIndex,
      marker.data[marker.lines[0].key],
    )
    const minMaxLine2 = getMinMax(
      startIndex,
      endIndex,
      marker.data[marker.lines[1].key],
    )

    return {
      min: Math.min(minMaxLine1.min, minMaxLine2.min),
      max: Math.max(minMaxLine1.max, minMaxLine2.max),
    }
  }

  if (marker.type === 'group') {
    if (!enabledMarkerIndexes[groupIndex]) {
      return INVISIBLE_MARKER_MIN_MAX
    }

    let currentMin = +Infinity
    let currentMax = -Infinity

    for (let childIndex = 0; childIndex < marker.markers.length; childIndex++) {
      const child = marker.markers[childIndex]
      const minmax = getMarkerMinMax(
        startX,
        endX,
        startIndex,
        endIndex,
        child,
        groupIndex,
        enabledMarkerIndexes,
      )

      currentMin = Math.min(currentMin, minmax.min)
      currentMax = Math.max(currentMax, minmax.max)
    }

    return { min: currentMin, max: currentMax }
  }

  assertNever(marker)
}
