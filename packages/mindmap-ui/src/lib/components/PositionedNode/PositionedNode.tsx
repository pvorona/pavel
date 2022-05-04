import classNames from 'classnames'
import { memo } from 'react'
import { Coordinate, PositionedMindMapNode } from '../../modules'
import styles from './PositionedNode.module.scss'

const SPACING = {
  VERTICAL: 16 * 8,
  HORIZONTAL: 16 * 6,
}

export const PositionedNode = memo(function PositionedNode({
  node,
  root,
  origin,
}: {
  node: PositionedMindMapNode
  root?: boolean
  origin: Coordinate
}) {
  const top = root
    ? 0
    : `${(node.coordinate.y - origin.y) * SPACING.VERTICAL}px`
  const left = root
    ? 0
    : `calc(100% + ${(node.coordinate.x - origin.x) * SPACING.HORIZONTAL}px)`

  return (
    <div
      className={classNames('whitespace-nowrap absolute', {
        [styles['RootNode']]: root,
        [styles['Node']]: !root,
      })}
      style={{ top, left }}
    >
      {node.value}
      {node.children?.map((child, index) => (
        <PositionedNode node={child} key={index} origin={node.coordinate} />
      ))}
    </div>
  )
})
