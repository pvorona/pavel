import { assert, isNull } from '@pavel/assert'
import { effect, ReadonlySubject } from '@pavel/observable'
import { createObservers } from '@pavel/utils'
import { ChartContext, InternalMarker } from '../../types'
import { toBitMapSize } from '../../util'
import { clearRect, setCanvasSize } from '../renderers'
import { Component } from '../types'
import { XMarker } from './XMarker'
import { RectMarker } from './RectMarker'
import { scheduleTask, throttleTask } from '@pavel/scheduling'

type MarkersProps = {
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly markers: readonly InternalMarker[]
  readonly startX: ReadonlySubject<number>
  readonly endX: ReadonlySubject<number>
  readonly min: ReadonlySubject<number>
  readonly max: ReadonlySubject<number>
}

export const Markers: Component<MarkersProps, ChartContext> = ({
  width,
  height,
  markers,
  startX,
  endX,
  min,
  max,
}) => {
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

    for (const marker of markers) {
      if (marker.type === 'x') {
        const { render } = XMarker({
          startX,
          endX,
          context,
          marker,
          width,
          height,
          onChange: scheduleRenderMarkers,
        })

        markersRenders.register(render)

        continue
      }

      if (marker.type === 'rect') {
        const { render } = RectMarker({
          startX,
          endX,
          context,
          marker,
          width,
          height,
          min,
          max,
          onChange: scheduleRenderMarkers,
        })

        markersRenders.register(render)

        continue
      }

      throw new Error('Not implemented')
    }

    return { element, context }
  }
}
