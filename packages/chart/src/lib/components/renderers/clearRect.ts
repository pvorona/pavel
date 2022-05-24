import { BitMapSize } from '../../types'

export function clearRect(
  context: CanvasRenderingContext2D,
  x: BitMapSize,
  y: BitMapSize,
  width: BitMapSize,
  height: BitMapSize,
) {
  context.clearRect(x, y, width, height)
}
