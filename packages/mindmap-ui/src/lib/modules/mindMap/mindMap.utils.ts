import { makeCached } from '@pavel/utils'
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
} as const

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

  if (node.children.length === 1) {
    const positionedChildren = node.children.map(child =>
      computeGeometry(child, direction, currentCoordinate),
    )

    return {
      ...node,
      coordinate: currentCoordinate,
      children: positionedChildren,
      width: computeBranchingWidth(node),
    }
  }

  if (node.children.length % 2 === 0) {
    const branchSize = node.children.length / 2
    const positionedChildren: PositionedMindMapNode[] = []
    const width = computeBranchingWidth(node)
    const averageBranchWidth = (width - 1) / 2 / branchSize

    for (let i = 0; i < branchSize; i++) {
      const child = node.children[i]
      const childOrigin = addCoordinates(currentCoordinate, {
        x: 0,
        y: (i - branchSize) * averageBranchWidth,
      })
      const positionedChild = computeGeometry(child, direction, childOrigin)
      positionedChildren.push(positionedChild)
    }

    for (let i = branchSize; i < node.children.length; i++) {
      const child = node.children[i]
      const childOrigin = addCoordinates(currentCoordinate, {
        x: 0,
        y: (i - branchSize + 1) * averageBranchWidth,
      })
      const positionedChild = computeGeometry(child, direction, childOrigin)
      positionedChildren.push(positionedChild)
    }

    return {
      ...node,
      children: positionedChildren,
      coordinate: currentCoordinate,
      width,
    }
  }

  if (node.children.length % 2 !== 0) {
    const branchSize = Math.floor(node.children.length / 2)
    const positionedChildren: PositionedMindMapNode[] = []
    const width = computeBranchingWidth(node)
    const averageBranchWidth = (width - 1) / 2 / branchSize

    for (let i = 0; i < branchSize; i++) {
      const child = node.children[i]
      // Account for direction
      const childOrigin = addCoordinates(currentCoordinate, {
        x: 0,
        y: (i - branchSize) * averageBranchWidth,
      })
      const positionedChild = computeGeometry(child, direction, childOrigin)
      positionedChildren.push(positionedChild)
    }

    const middleChild = node.children[branchSize]
    const positionedMiddleChild = computeGeometry(
      middleChild,
      direction,
      currentCoordinate,
    )

    positionedChildren.push(positionedMiddleChild)

    for (let i = branchSize + 1; i < node.children.length; i++) {
      const child = node.children[i]
      // Account for direction
      const childOrigin = addCoordinates(currentCoordinate, {
        x: 0,
        y: (i - branchSize) * averageBranchWidth,
      })
      const positionedChild = computeGeometry(child, direction, childOrigin)
      positionedChildren.push(positionedChild)
    }

    return {
      ...node,
      children: positionedChildren,
      coordinate: currentCoordinate,
      width,
    }
  }

  throw new Error('Not implemented')
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

function sum(numbers: number[]): number {
  let sum = 0

  for (const number of numbers) {
    sum += number
  }

  return sum
}
