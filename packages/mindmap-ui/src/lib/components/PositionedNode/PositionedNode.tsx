import classNames from 'classnames'
import { memo, useEffect, useState } from 'react'
import { DIRECTION, PositionedMindMapNode, Rect, SPACING } from '../../modules'
import { NodeLink } from '../NodeLink'
import styles from './PositionedNode.module.scss'

export const PositionedNode = memo(function PositionedNode({
  parent,
  node,
  isRoot,
  parentRect,
}: {
  node: PositionedMindMapNode
  parent?: PositionedMindMapNode
  isRoot?: boolean
  parentRect?: Rect
}) {
  const [currentNodeRect, setCurrentNodeRect] = useState<Rect>()
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (element === null) {
      return
    }

    const width = element.offsetWidth
    const height = element.offsetHeight
    const x = element.offsetLeft

    const parentRectSizeOffset = (() => {
      if (!parentRect || !parent) {
        return 0
      }

      return (
        parentRect.y +
        parentRect.height / 2 -
        height / 2 -
        parent.coordinate.y * SPACING.VERTICAL
      )
    })()

    const y = node.coordinate.y * SPACING.VERTICAL + parentRectSizeOffset

    setCurrentNodeRect({
      x,
      y,
      width,
      height,
    })
  }, [element, node.coordinate.y, parent, parentRect])

  if (!parentRect && !isRoot) {
    return null
  }

  const horizontalDirection = (() => {
    if (node.coordinate.x < 0) {
      return DIRECTION.LEFT
    }

    if (node.coordinate.x > 0) {
      return DIRECTION.RIGHT
    }

    return DIRECTION.NONE
  })()

  const top = (() => {
    if (!currentNodeRect) {
      return 0
    }

    return currentNodeRect.y
  })()
  const horizontalPosition = (() => {
    if (!parentRect) {
      return { left: 0 }
    }

    if (horizontalDirection === DIRECTION.LEFT) {
      return { right: -parentRect.x + SPACING.HORIZONTAL }
    }

    if (horizontalDirection === DIRECTION.RIGHT) {
      return {
        left: parentRect.x + parentRect.width + SPACING.HORIZONTAL,
      }
    }

    throw new Error('Not implemented')
  })()

  return (
    <>
      {parentRect && currentNodeRect && parent && (
        <NodeLink
          parentRect={parentRect}
          currentNodeRect={currentNodeRect}
          node={node}
          parent={parent}
        />
      )}
      <div
        ref={setElement}
        className={classNames('whitespace-nowrap absolute p-1', {
          [styles['RootNode']]: isRoot,
          [styles['Node']]: !isRoot,
        })}
        style={{
          top,
          color: isRoot ? undefined : 'hsl(var(--c-1-20))',
          ...horizontalPosition,
        }}
      >
        {node.value}
      </div>
      {node.children?.map((child, index) => (
        <PositionedNode
          parent={node}
          node={child}
          key={index}
          parentRect={currentNodeRect}
        />
      ))}
    </>
  )
})
