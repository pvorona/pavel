import { InternalLineMarkerStyle } from '../../types'
import { toBitMapSize } from '../../util'
import { Point } from '../types'
import { applyCanvasStyle } from './applyCanvasStyle'
import { MARGIN_OVERSHOOT } from './constants'
import { lineTo } from './lineTo'

export function renderFlow(
  context: CanvasRenderingContext2D,
  edge1: Point[],
  edge2: Point[],
  edge1Style: InternalLineMarkerStyle,
  edge2Style: InternalLineMarkerStyle,
  opacity: number,
  fillStyle: string,
) {
  if (opacity === 0) {
    return
  }

  context.beginPath()

  applyCanvasStyle(context, { opacity, ...edge1Style })

  for (let j = 0; j < edge1.length; j++) {
    const { x, y } = edge1[j]

    lineTo(context, toBitMapSize(x), toBitMapSize(y))
  }

  context.stroke()

  lineTo(
    context,
    toBitMapSize(edge1[edge1.length - 1].x + MARGIN_OVERSHOOT),
    toBitMapSize(edge1[edge1.length - 1].y),
  )

  lineTo(
    context,
    toBitMapSize(edge1[edge1.length - 1].x + MARGIN_OVERSHOOT),
    toBitMapSize(edge2[edge2.length - 1].y),
  )

  applyCanvasStyle(context, { opacity, ...edge2Style })

  for (let j = edge2.length - 1; j >= 0; j--) {
    const { x, y } = edge2[j]

    lineTo(context, toBitMapSize(x), toBitMapSize(y))
  }

  applyCanvasStyle(context, { opacity, fillStyle })

  context.fill()
  context.stroke()
}
