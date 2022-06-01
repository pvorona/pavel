import { BitMapSize, LineWidth } from '../../types'

export function strokeRect(
  context: CanvasRenderingContext2D,
  x: BitMapSize,
  y: BitMapSize,
  width: BitMapSize,
  height: BitMapSize,
  stroke: string,
  lineWidth: BitMapSize,
) {
  context.strokeStyle = stroke
  context.lineWidth = lineWidth
  context.strokeRect(x, y, width, height)
}
