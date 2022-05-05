import { MindMapNode } from '../tree'
import { Coordinate, PositionedMindMapNode } from './mindMap.types'
import { computeGeometry, computeMaxBranchingLevel } from './mindMap.utils'

describe('computeGeometry', () => {
  it('works with single node', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [],
    }
    const direction: Coordinate = {
      x: 1,
      y: 0,
    }
    const result = computeGeometry(node, direction)
    const expectedResult: PositionedMindMapNode = {
      value: 'root',
      children: [],
      coordinate: {
        x: 1,
        y: 0,
      },
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with line of nodes without branching', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
          children: [
            {
              value: 'child 2',
              children: [{ value: 'child 3' }],
            },
          ],
        },
      ],
    }
    const direction: Coordinate = {
      x: 1,
      y: 0,
    }
    const result = computeGeometry(node, direction)
    const expectedResult: PositionedMindMapNode = {
      value: 'root',
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [
        {
          value: 'child 1',
          coordinate: { x: 2, y: 0 },
          children: [
            {
              value: 'child 2',
              coordinate: { x: 3, y: 0 },
              children: [
                {
                  value: 'child 3',
                  coordinate: { x: 4, y: 0 },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with node with branches 2 branches', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
        },
        { value: 'child 2' },
      ],
    }
    const direction: Coordinate = {
      x: 1,
      y: 0,
    }
    const result = computeGeometry(node, direction)
    const expectedResult: PositionedMindMapNode = {
      value: 'root',
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [
        {
          value: 'child 1',
          coordinate: { x: 2, y: -0.5 },
          children: [],
        },
        {
          value: 'child 2',
          coordinate: { x: 2, y: 0.5 },
          children: [],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with node with branches 3 branches', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
        },
        { value: 'child 2' },
        { value: 'child 3' },
      ],
    }
    const direction: Coordinate = {
      x: 1,
      y: 0,
    }
    const result = computeGeometry(node, direction)
    const expectedResult: PositionedMindMapNode = {
      value: 'root',
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [
        {
          value: 'child 1',
          coordinate: { x: 2, y: -1 },
          children: [],
        },
        {
          value: 'child 2',
          coordinate: { x: 2, y: 0 },
          children: [],
        },
        {
          value: 'child 3',
          coordinate: { x: 2, y: 1 },
          children: [],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })
})

// describe('computeMaxBranchingLevel', () => {
//   it('works with nodes without children', () => {
//     const node: MindMapNode = {
//       value: 'root',
//       children: [],
//     }
//     const result = computeMaxBranchingLevel(node)
//     const expectedResult = 0

//     expect(result).toStrictEqual(expectedResult)
//   })
// })
