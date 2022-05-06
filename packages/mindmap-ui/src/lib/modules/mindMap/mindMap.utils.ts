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
  RIGHT: { x: 1, y: 0 },
  LEFT: { x: -1, y: 0 },
} as const

export function createPositionedTree(node: MindMapNode): PositionedMindMapNode {
  if (!node.children || node.children.length === 0) {
    return computeGeometry(node)
  }

  const childrenCount = node.children.length
  const halfChildrenCount = Math.floor(childrenCount / 2)

  const left = node.children.slice(0, halfChildrenCount)
  const right = node.children.slice(halfChildrenCount)

  const withLeftChildren = { ...node, children: left }
  const withRightChildren = { ...node, children: right }

  const withLeftChildrenPositioned = computeGeometry(
    withLeftChildren,
    DIRECTION.LEFT,
  )
  const withRightChildrenPositioned = computeGeometry(
    withRightChildren,
    DIRECTION.RIGHT,
  )

  const positionedRootNode = {
    ...withLeftChildrenPositioned,
    children: [
      ...(withLeftChildrenPositioned.children ?? []),
      ...(withRightChildrenPositioned.children ?? []),
    ],
  }

  return positionedRootNode
}

export function computeGeometry(
  node: MindMapNode,
  direction: Coordinate = DIRECTION.RIGHT,
  origin: Coordinate = ORIGIN,
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

  let currentOffset = width === 1 ? -0.5 : -(width - 1) / 2
  // let currentOffset = -(width-1) / 2

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

  const evenChildrenCountModifier = node.children.length % 2 === 0 ? 1 : 0

  return (
    sum(node.children.map(computeBranchingWidth)) + evenChildrenCountModifier
  )
}
