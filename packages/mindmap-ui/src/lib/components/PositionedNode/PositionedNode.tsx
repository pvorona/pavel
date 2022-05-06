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

  const anchorX = parentRect ? parentRect.x + parentRect.width : 0
  const top = node.coordinate.y * SPACING.VERTICAL
  const left = anchorX + SPACING.HORIZONTAL

  return (
    <>
      {parentRect && currentNodeRect && (
        <NodeLink parentRect={parentRect} currentNodeRect={currentNodeRect} />
      )}
      <div
        ref={setElement}
        className={classNames('whitespace-nowrap absolute p-2', {
          [styles['RootNode']]: isRoot,
          [styles['Node']]: !isRoot,
        })}
        style={{ top, left, color: isRoot ? undefined : 'hsl(var(--c-1-20))' }}
      >
        {node.value}
      </div>
      {node.children?.map((child, index) => (
        <PositionedNode node={child} key={index} parentRect={currentNodeRect} />
      ))}
    </>
  )
})
