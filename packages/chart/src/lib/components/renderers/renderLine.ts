import { BitMapSize } from '../../types'

export function renderLine(
  context: CanvasRenderingContext2D,
  x1: BitMapSize,
  y1: BitMapSize,
  x2: BitMapSize,
  y2: BitMapSize,
  color: string,
  lineWidth: BitMapSize,
) {
  context.beginPath()
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}
