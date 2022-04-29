import { MindMapNode } from './tree.types'

export const TREE_ID_QUERY_NAME = 'id'

export const DEFAULT_TREE: MindMapNode = {
  value: 'Root node',
  children: [
    {
      value: 'Branch A',
      children: [
        {
          value: 'Leaf AA',
        },
        {
          value: 'Leaf AB',
        },
      ],
    },
    {
      value: 'Branch B',
      children: [
        {
          value: 'Leaf BA',
        },
      ],
    },
    {
      value: 'Leaf A',
    },
  ],
}
