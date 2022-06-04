import { LineWidth } from '../../types'
import { toBitMapSize } from '../../util'
import { Point } from '../types'
import { applyCanvasStyle } from './applyCanvasStyle'
import { lineTo } from './lineTo'

export function renderSeries(
  context: CanvasRenderingContext2D,
  points: Point[],
  strokeStyle: string,
  opacity: number,
  lineWidth: LineWidth,
  lineJoin: CanvasLineJoin,
  lineCap: CanvasLineCap,
) {
  if (opacity === 0) {
    return
  }

  applyCanvasStyle(context, {
    opacity,
    strokeStyle,
    lineWidth,
    lineCap,
    lineJoin,
  })

  context.beginPath()

  for (let j = 0; j < points.length; j++) {
    const { x, y } = points[j]

    lineTo(context, toBitMapSize(x), toBitMapSize(y))
  }

  context.stroke()
}
