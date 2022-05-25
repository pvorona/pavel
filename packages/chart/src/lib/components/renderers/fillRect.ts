import { BitMapSize } from '../../types'

export function fillRect(
  context: CanvasRenderingContext2D,
  x: BitMapSize,
  y: BitMapSize,
  width: BitMapSize,
  height: BitMapSize,
  fill: string,
) {
  context.fillStyle = fill
  context.fillRect(x, y, width, height)
}
