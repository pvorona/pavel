import { BitMapSize } from '../../types'

export function moveTo(
  context: CanvasRenderingContext2D,
  x: BitMapSize,
  y: BitMapSize,
) {
  context.moveTo(x, y)
}
