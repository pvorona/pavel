import classNames from 'classnames'
import { memo, useEffect, useState } from 'react'
import { Coordinate, PositionedMindMapNode } from '../../modules'
import styles from './PositionedNode.module.scss'

const SPACING = {
  VERTICAL: 16 * 3,
  HORIZONTAL: 16 * 2,
  STROKE_WIDTH: 4,
}

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export const PositionedNode = memo(function PositionedNode({
  node,
  isRoot,
  parentRect,
}: {
  node: PositionedMindMapNode
  isRoot?: boolean
  parentRect?: Rect
}) {
  const [currentNodeRect, setCurrentNodeRect] = useState<Rect>()
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (element === null) {
      return
    }

    setCurrentNodeRect({
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    })
  }, [element])

  if (!parentRect && !isRoot) {
    return null
  }

  const anchorX = parentRect ? parentRect.x + parentRect.width : 0
  const anchorY = parentRect ? parentRect.y + parentRect.height / 2 : 0

  const top = node.coordinate.y * SPACING.VERTICAL
  const left = anchorX + SPACING.HORIZONTAL

  const isUpword = currentNodeRect?.y < parentRect?.y
  const isStraight = currentNodeRect?.y === parentRect?.y
  const lineHeight = isStraight
    ? SPACING.STROKE_WIDTH
    : Math.abs(
        parentRect?.y +
          parentRect?.height / 2 -
          (currentNodeRect?.y + currentNodeRect?.height / 2),
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
    <>
      {!isRoot && currentNodeRect && (
        <svg
          width={SPACING.HORIZONTAL + 2 * SPACING.STROKE_WIDTH}
          height={lineHeight + 2 * SPACING.STROKE_WIDTH}
          style={{
            stroke: 'hsl(var(--c-2-70))',
            strokeWidth: SPACING.STROKE_WIDTH,
            position: 'absolute',
            left: anchorX,
            top: !isUpword ? anchorY : undefined,
            bottom: isUpword ? -anchorY : undefined,
            transform: isUpword ? 'scaleY(-1)' : undefined,
            strokeLinecap: 'round',
            fill: 'none',
          }}
        >
          {/* <line
            x1={SPACING.STROKE_WIDTH / 2}
            y1={SPACING.STROKE_WIDTH / 2}
            x2={SPACING.HORIZONTAL - SPACING.STROKE_WIDTH / 2}
            y2={lineHeight - SPACING.STROKE_WIDTH / 2}
          /> */}

          <path d={pathD} />
        </svg>
      )}
      <div
        ref={setElement}
        className={classNames('whitespace-nowrap absolute p-2', {
          [styles['RootNode']]: isRoot,
          [styles['Node']]: !isRoot,
        })}
        style={{ top, left, color: isRoot ? undefined : 'hsl(var(--c-1-20))' }}
      >
        {node.value} [width: {node.width} y: {node.coordinate.y}]
      </div>
      {node.children?.map((child, index) => (
        <PositionedNode node={child} key={index} parentRect={currentNodeRect} />
      ))}
    </>
  )
})
