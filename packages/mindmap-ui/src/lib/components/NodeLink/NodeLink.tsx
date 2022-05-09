import { memo } from 'react'
import { DIRECTION, PositionedMindMapNode, Rect, SPACING } from '../../modules'

function getRectVerticalCenter(rect: Rect): number {
  return rect.y + rect.height / 2
}

export const NodeLink = memo(function NodeLink({
  parentRect,
  currentNodeRect,
  node,
  parent,
}: {
  parentRect: Rect
  currentNodeRect: Rect
  node: PositionedMindMapNode
  parent: PositionedMindMapNode
}) {
  const horizontalDirection = (() => {
    if (node.coordinate.x < parent.coordinate.x) {
      return DIRECTION.LEFT
    }

    if (node.coordinate.x > parent.coordinate.x) {
      return DIRECTION.RIGHT
    }

    throw new Error('Not implemented')
  })()
  const verticalDirection = (() => {
    if (node.coordinate.y < parent.coordinate.y) {
      return DIRECTION.UP
    }

    if (node.coordinate.y > parent.coordinate.y) {
      return DIRECTION.DOWN
    }

    return DIRECTION.NONE
  })()

  const parentTop = parentRect.y
  const parentBottom = parentRect.y + parentRect.height

  const currentTop = currentNodeRect.y
  const currentBottom = currentNodeRect.y + currentNodeRect.height

  const top = Math.min(currentTop, parentTop)
  const bottom = Math.max(currentBottom, parentBottom)

  const horizontalPosition = (() => {
    if (horizontalDirection === DIRECTION.LEFT) {
      return {
        right: parentRect.x,
        left: currentNodeRect.x + currentNodeRect.width,
      }
    }

    if (horizontalDirection === DIRECTION.RIGHT) {
      return {
        right: currentNodeRect.x,
        left: parentRect.x + parentRect.width,
      }
    }

    throw new Error('Not implemented')
  })()

  const height = Math.abs(top - bottom)
  const width = horizontalPosition.right - horizontalPosition.left

  const pathD = (() => {
    const startX = (() => {
      if (horizontalDirection === DIRECTION.RIGHT) {
        return SPACING.STROKE_WIDTH
      }

      if (horizontalDirection === DIRECTION.LEFT) {
        return width - SPACING.STROKE_WIDTH
      }

      throw new Error('Not implemented')
    })()
    const startY = (() => {
      if (verticalDirection === DIRECTION.DOWN) {
        return parentRect.height / 2
      }

      if (verticalDirection === DIRECTION.UP) {
        return height - parentRect.height / 2
      }

      if (verticalDirection === DIRECTION.NONE) {
        return height / 2
      }

      throw new Error('Not implemented')
    })()
    const endX = (() => {
      if (horizontalDirection === DIRECTION.LEFT) {
        return SPACING.STROKE_WIDTH
      }

      if (horizontalDirection === DIRECTION.RIGHT) {
        return width - SPACING.STROKE_WIDTH
      }

      throw new Error('Not implemented')
    })()
    const endY = (() => {
      if (verticalDirection === DIRECTION.UP) {
        return currentNodeRect.height / 2
      }

      if (verticalDirection === DIRECTION.DOWN) {
        return height - currentNodeRect.height / 2
      }

      if (verticalDirection === DIRECTION.NONE) {
        return height / 2
      }

      throw new Error('Not implemented')
    })()
    const controlPoint1X = startX + Math.random() * (endX - startX)
    const controlPoint1Y = startY + Math.random() * (endY - startY)
    const controlPoint2X =
      controlPoint1X + Math.random() * (endX - controlPoint1X)
    const controlPoint2Y =
      controlPoint1Y + Math.random() * (endY - controlPoint1Y)

    return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endX} ${endY}`
  })()

  return (
    <svg
      width={width}
      height={height}
      style={{
        stroke: 'hsl(var(--c-2-70))',
        strokeWidth: SPACING.STROKE_WIDTH,
        position: 'absolute',
        top,
        bottom,
        strokeLinecap: 'round',
        fill: 'none',
        ...horizontalPosition,
      }}
    >
      <path d={pathD} />
    </svg>
  )
})
