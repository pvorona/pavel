import { compute, effect } from '@pavel/observable'
import { ChartContext, InternalXMarker as XMarkerType } from '../../types'
import { toBitMapSize, xToScreenX } from '../../util'
import { clearRect, renderLine } from '../renderers'

type XMarkerProps = {
  context: CanvasRenderingContext2D
  marker: XMarkerType
}

const CLEARING_BUFFER_PX = 2

export const XMarker = (
  { context, marker: { x, color, lineWidth } }: XMarkerProps,
  { startX, endX, width, canvasHeight }: ChartContext,
) => {
  const line = compute(
    [startX, endX, width, canvasHeight],
    (startX, endX, width, canvasHeight) => {
      const screenX = xToScreenX(startX, endX, width, x)

      return {
        x1: screenX,
        y1: 0,
        x2: screenX,
        y2: canvasHeight,
      }
    },
  )

  effect([line], line => {
    console.log('render line')
    renderLine(
      context,
      toBitMapSize(line.x1),
      toBitMapSize(line.y1),
      toBitMapSize(line.x2),
      toBitMapSize(line.y2),
      color,
      toBitMapSize(lineWidth),
    )

    return () => {
      clearRect(
        context,
        toBitMapSize(line.x1 - lineWidth),
        toBitMapSize(line.y1 - lineWidth),
        toBitMapSize(line.x2 - line.x1 + lineWidth + CLEARING_BUFFER_PX),
        toBitMapSize(line.y2 - line.y1 + lineWidth + CLEARING_BUFFER_PX),
      )
    }
  })
}
