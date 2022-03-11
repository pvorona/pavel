import { ensureInBounds } from './ensureInBounds'
import { getDistance } from './getDistance'

export function getDistanceBetweenPointAndRectangle(
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

  return getDistance([x, y], [closestX, closestY])
}
