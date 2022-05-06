import classNames from 'classnames'
import { memo, useEffect, useState } from 'react'
import { PositionedMindMapNode, Rect, SPACING } from '../../modules'
import { NodeLink } from '../NodeLink'
import styles from './PositionedNode.module.scss'

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

  const anchorX = (() => {
    if (!parentRect) {
      return { left: 0 }
    }

    if (node.coordinate.x < 0) {
      return { right: -parentRect.x + SPACING.HORIZONTAL }
    }

    return {
      left: parentRect.x + parentRect.width + SPACING.HORIZONTAL,
    }
  })()
  const top = node.coordinate.y * SPACING.VERTICAL

  return (
    <>
      {parentRect && currentNodeRect && (
        <NodeLink
          node={node}
          parentRect={parentRect}
          currentNodeRect={currentNodeRect}
        />
      )}
      <div
        ref={setElement}
        className={classNames('whitespace-nowrap absolute p-2', {
          [styles['RootNode']]: isRoot,
          [styles['Node']]: !isRoot,
        })}
        style={{
          top,
          color: isRoot ? undefined : 'hsl(var(--c-1-20))',
          ...anchorX,
        }}
      >
        {node.value} {JSON.stringify(node.coordinate)} {node.width}
      </div>
      {node.children?.map((child, index) => (
        <PositionedNode node={child} key={index} parentRect={currentNodeRect} />
      ))}
    </>
  )
})
