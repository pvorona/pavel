import { MindMapNode } from '../tree'
import { Coordinate, PositionedMindMapNode } from './mindMap.types'
import { computeGeometry, computeBranchingWidth } from './mindMap.utils'

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
      width: 1,
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [],
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with sequence of nodes with a single child', () => {
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
      width: 1,
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [
        {
          value: 'child 1',
          width: 1,
          coordinate: { x: 2, y: 0 },
          children: [
            {
              value: 'child 2',
              width: 1,
              coordinate: { x: 3, y: 0 },
              children: [
                {
                  value: 'child 3',
                  width: 1,
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

  it('works with node with 2 branches', () => {
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
      width: 3,
      children: [
        {
          value: 'child 1',
          width: 1,
          coordinate: { x: 2, y: -1 },
          children: [],
        },
        {
          value: 'child 2',
          width: 1,
          coordinate: { x: 2, y: 1 },
          children: [],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with node with 3 branches', () => {
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
      width: 3,
      coordinate: {
        x: 1,
        y: 0,
      },
      children: [
        {
          value: 'child 1',
          coordinate: { x: 2, y: -1 },
          width: 1,

          children: [],
        },
        {
          value: 'child 2',
          coordinate: { x: 2, y: 0 },
          width: 1,
          children: [],
        },
        {
          value: 'child 3',
          coordinate: { x: 2, y: 1 },
          width: 1,
          children: [],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })

  it('pushes branches away from each other', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
          children: [
            {
              value: 'sub child 1',
            },
            {
              value: 'sub child 2',
            },
          ],
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
      width: 3,
      children: [
        {
          value: 'child 1',
          width: 2,
          coordinate: { x: 2, y: -2 },
          children: [
            {
              value: 'sub child 1',
              children: [],
              width: 1,
              coordinate: { x: 3, y: -2.5 },
            },
            {
              value: 'sub child 2',
              children: [],
              width: 1,
              coordinate: { x: 3, y: -1.5 },
            },
          ],
        },
        {
          value: 'child 2',
          width: 1,
          coordinate: { x: 2, y: 0.5 },
          children: [],
        },
      ],
    }

    expect(result).toStrictEqual(expectedResult)
  })
})

describe('computeBranchingWidth', () => {
  it('works with nodes without children', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [],
    }
    const result = computeBranchingWidth(node)
    const expectedResult = 1

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with nodes with a sequence of children', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child',
          children: [
            {
              value: 'sub child',
            },
          ],
        },
      ],
    }
    const result = computeBranchingWidth(node)
    const expectedResult = 1

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with nodes with branch of 2 nodes', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
        },
        {
          value: 'child 2',
        },
      ],
    }
    const result = computeBranchingWidth(node)
    const expectedResult = 3

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with nodes with branches of 3 nodes', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
        },
        {
          value: 'child 2',
        },
        {
          value: 'child 3',
        },
      ],
    }
    const result = computeBranchingWidth(node)
    const expectedResult = 3

    expect(result).toStrictEqual(expectedResult)
  })

  it('works with nodes with nested branches', () => {
    const node: MindMapNode = {
      value: 'root',
      children: [
        {
          value: 'child 1',
          children: [
            {
              value: 'sub child 1',
            },
            {
              value: 'sub child 2',
            },
          ],
        },
        {
          value: 'child 2',
          children: [
            {
              value: 'sub child 3',
            },
            {
              value: 'sub child 4',
            },
          ],
        },
      ],
    }
    const result = computeBranchingWidth(node)
    const expectedResult = 7

    expect(result).toStrictEqual(expectedResult)
  })
})
