import { memo } from 'react'
import { useSelector } from 'react-redux'
import { ORIGIN, selectPositionedTree } from '../../modules'
import { PositionedNode } from '../PositionedNode'

export const Tree = memo(function Tree() {
  const positionedRootNode = useSelector(selectPositionedTree)

  if (!positionedRootNode) {
    return <span>Loading</span>
  }

  return <PositionedNode node={positionedRootNode} isRoot origin={ORIGIN} />
})
