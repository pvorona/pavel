import { memo } from 'react'
import { Rect, SPACING } from '../../modules'

export const Link = memo(function Link({
  parentRect,
  currentNodeRect,
}: {
  parentRect: Rect
  currentNodeRect: Rect
}) {
  const anchorX = parentRect.x + parentRect.width
  const anchorY = parentRect.y + parentRect.height / 2

  const isStraight = currentNodeRect.y === parentRect.y
  const isUpward = currentNodeRect.y < parentRect.y

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
        left: anchorX,
        top: !isUpward ? anchorY : undefined,
        bottom: isUpward ? -anchorY : undefined,
        transform: isUpward ? 'scaleY(-1)' : undefined,
        strokeLinecap: 'round',
        fill: 'none',
      }}
    >
      <path d={pathD} />
    </svg>
  )
})