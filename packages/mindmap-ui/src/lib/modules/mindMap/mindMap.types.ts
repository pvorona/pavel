import { MindMapNode } from '../tree'

export type Coordinate = {
  x: number
  y: number
}

export type PositionedMindMapNode = {
  // width: number
  value: MindMapNode['value']
  coordinate: Coordinate
  children?: PositionedMindMapNode[]
}
