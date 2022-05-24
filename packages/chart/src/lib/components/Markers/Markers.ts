import { assert, isNull } from '@pavel/assert'
import { effect } from '@pavel/observable'
import { ChartContext, InternalChartOptions } from '../../types'
import { toBitMapSize } from '../../util'
import { setCanvasSize } from '../renderers'
import { Component } from '../types'
import { XMarker } from '../XMarker'

type MarkersProps = InternalChartOptions

export const Markers: Component<MarkersProps, ChartContext> = (
  options,
  chartContext,
) => {
  const { width, canvasHeight } = chartContext
  const { element } = createDOM()

  effect(
    [width, canvasHeight],
    (width, height) => {
      setCanvasSize(element, toBitMapSize(width), toBitMapSize(height))
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

    setCanvasSize(
      element,
      toBitMapSize(options.width),
      toBitMapSize(chartContext.canvasHeight.get()),
    )

    for (const marker of options.markers) {
      if (marker.type === 'x') {
        XMarker({ context, marker }, chartContext)
      }
    }

    return { element }
  }
}
