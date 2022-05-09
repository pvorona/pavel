import { sum } from '@pavel/utils'
import { MindMapNode } from '../tree'
import { Coordinate, PositionedMindMapNode } from './mindMap.types'

export function addCoordinates(a: Coordinate, b: Coordinate): Coordinate {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

export const ORIGIN: Coordinate = { x: 0, y: 0 }
export const DIRECTION = {
  NONE: { x: 0, y: 0 },
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  RIGHT: { x: 1, y: 0 },
  LEFT: { x: -1, y: 0 },
} as const

export function computeGeometry(
  node: MindMapNode,
  direction: Coordinate = DIRECTION.RIGHT,
  origin: Coordinate = DIRECTION.LEFT,
): PositionedMindMapNode {
  const currentCoordinate = addCoordinates(origin, direction)

  if (!node.children || node.children.length === 0) {
    return {
      ...node,
      width: computeBranchingWidth(node),
      children: [],
      coordinate: currentCoordinate,
    }
  }

  const positionedChildren: PositionedMindMapNode[] = []
  const width = computeBranchingWidth(node)

  let currentOffset = -width / 2

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    const childWidth = computeBranchingWidth(child)
    const childOrigin = addCoordinates(currentCoordinate, {
      x: 0,
      y: currentOffset + childWidth / 2,
    })
    const positionedChild = computeGeometry(child, direction, childOrigin)
    positionedChildren.push(positionedChild)

    currentOffset += childWidth
  }

  return {
    ...node,
    children: positionedChildren,
    coordinate: currentCoordinate,
    width,
  }
}

export function computeBranchingWidth(node: MindMapNode): number {
  if (!node.children || node.children.length === 0) {
    return 1
  }

  return sum(node.children.map(computeBranchingWidth))
}
