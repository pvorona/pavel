import { assert, isNull } from '@pavel/assert'
import { effect, ReadonlySubject } from '@pavel/observable'
import { createObservers } from '@pavel/utils'
import { ChartContext, InternalMarker, InternalSimpleMarker } from '../../types'
import { toBitMapSize } from '../../util'
import { clearRect, setCanvasSize } from '../renderers'
import { Component } from '../types'
import { XMarker } from './XMarker'
import { YMarker } from './YMarker'
import { RectMarker } from './RectMarker'
import { throttleTask } from '@pavel/scheduling'

type MarkersProps = {
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly markers: readonly InternalMarker[]
  readonly startX: ReadonlySubject<number>
  readonly endX: ReadonlySubject<number>
  readonly min: ReadonlySubject<number>
  readonly max: ReadonlySubject<number>
}

export const Markers: Component<MarkersProps, ChartContext> = (
  { width, height, markers, startX, endX, min, max },
  chartContext,
) => {
  const markersRenders = createObservers()
  const scheduleRenderMarkers = throttleTask(function renderMarkers() {
    clearRect(
      context,
      0,
      0,
      toBitMapSize(width.get()),
      toBitMapSize(height.get()),
    )
    markersRenders.notify()
  })

  const { element, context } = createDOM()

  effect(
    [width, height],
    (width, height) => {
      setCanvasSize(element, toBitMapSize(width), toBitMapSize(height))

      markersRenders.notify()
    },
    { fireImmediately: false },
  )

  return { element }

  function createDOM() {
    const element = document.createElement('canvas')
    const context = element.getContext('2d')

    assert(!isNull(context), 'Cannot acquire canvas context')

    element.style.width = '100%'
    element.style.height = '100%'
    element.style.position = 'absolute'
    element.style.top = '0'

    setCanvasSize(
      element,
      toBitMapSize(width.get()),
      toBitMapSize(height.get()),
    )

    for (let index = 0; index < markers.length; index++) {
      const marker = markers[index]

      if (marker.type === 'group') {
        for (const childMarker of marker.markers) {
          // Markers inside a group have a single visibility state
          createSimpleMarker(childMarker, index, context)
        }

        continue
      }

      createSimpleMarker(marker, index, context)
    }

    return { element, context }
  }

  function createSimpleMarker(
    marker: InternalSimpleMarker,
    index: number,
    context: CanvasRenderingContext2D,
  ) {
    if (marker.type === 'x') {
      const { render } = XMarker(
        {
          index,
          startX,
          endX,
          context,
          marker,
          width,
          height,
          onChange: scheduleRenderMarkers,
        },
        chartContext,
      )

      markersRenders.register(render)

      return
    }

    if (marker.type === 'y') {
      const { render } = YMarker(
        {
          index,
          minY: min,
          maxY: max,
          context,
          marker,
          width,
          height,
          onChange: scheduleRenderMarkers,
        },
        chartContext,
      )

      markersRenders.register(render)

      return
    }

    if (marker.type === 'rect') {
      const { render } = RectMarker(
        {
          index,
          startX,
          endX,
          context,
          marker,
          width,
          height,
          min,
          max,
          onChange: scheduleRenderMarkers,
        },
        chartContext,
      )

      markersRenders.register(render)

      return
    }
  }
}
