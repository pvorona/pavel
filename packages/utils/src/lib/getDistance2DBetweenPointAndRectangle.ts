import { ensureInBounds } from './ensureInBounds'
import { getDistance2D } from './getDistance2D'

export function getDistance2DBetweenPointAndRectangle(
  [x, y]: [number, number],
  {
    left,
    top,
    right,
    bottom,
  }: { left: number; top: number; right: number; bottom: number },
): number {
  const closestX = ensureInBounds(x, left, right)
  const closestY = ensureInBounds(y, top, bottom)

  return getDistance2D([x, y], [closestX, closestY])
}
