import { memo } from 'react'
import { PositionedMindMapNode, Rect, SPACING } from '../../modules'

export const NodeLink = memo(function NodeLink({
  node,
  parentRect,
  currentNodeRect,
}: {
  node: PositionedMindMapNode
  parentRect: Rect
  currentNodeRect: Rect
}) {
  const isLeft = node.coordinate.x < 0
  const isStraight = currentNodeRect.y === parentRect.y
  const isUpward = currentNodeRect.y < parentRect.y

  const anchorX = (() => {
    if (isLeft) {
      return { right: Math.abs(parentRect.x) }
    }

    return { left: parentRect.x + parentRect.width }
  })()
  const anchorY = parentRect.y + parentRect.height / 2
  const transform = (() => {
    const scaleY = isUpward ? -1 : 1
    const scaleX = isLeft ? -1 : 1

    return { transform: `scale(${scaleX}, ${scaleY})` }
  })()

  const lineHeight = isStraight
    ? SPACING.STROKE_WIDTH
    : Math.abs(
        parentRect.y +
          parentRect.height / 2 -
          (currentNodeRect.y + currentNodeRect.height / 2),
      )

  const pathD = (() => {
    const startX = SPACING.STROKE_WIDTH
    const startY = SPACING.STROKE_WIDTH
    const endX = SPACING.HORIZONTAL - SPACING.STROKE_WIDTH
    const endY = lineHeight - SPACING.STROKE_WIDTH
    const controlPoint1X = startX + Math.random() * (endX - startX)
    const controlPoint1Y = startY + Math.random() * (endY - startY)
    const controlPoint2X =
      controlPoint1X + Math.random() * (endX - controlPoint1X)
    const controlPoint2Y =
      controlPoint1Y + Math.random() * (endY - controlPoint1Y)

    return `m ${startX} ${startY} c ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${endX} ${endY}`
  })()

  return (
    <svg
      width={SPACING.HORIZONTAL + 2 * SPACING.STROKE_WIDTH}
      height={lineHeight + 2 * SPACING.STROKE_WIDTH}
      style={{
        stroke: 'hsl(var(--c-2-70))',
        strokeWidth: SPACING.STROKE_WIDTH,
        position: 'absolute',
        top: !isUpward ? anchorY : undefined,
        bottom: isUpward ? -anchorY : undefined,
        strokeLinecap: 'round',
        fill: 'none',
        ...anchorX,
        ...transform,
      }}
    >
      <path d={pathD} />
    </svg>
  )
})
