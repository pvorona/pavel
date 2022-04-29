import { MindMapNode } from './tree.types'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function createTreeId(): string {
  let autoId = ''

  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }

  return autoId
}

const LEVEL_INDENT = '  '
const LEAF_INDENT = '- '

function treeToLines(tree: MindMapNode, indent = ''): string[] {
  const padding = indent ? `${indent}${LEAF_INDENT}` : indent

  const lines: string[] = [`${padding}${tree.value}`]

  if (tree.children) {
    for (const child of tree.children) {
      lines.push(...treeToLines(child, `${indent}${LEVEL_INDENT}`))
    }
  }

  return lines
}

export function treeToMarkdown(tree: MindMapNode): string {
  return treeToLines(tree).join('\n')
}

function countLeadingWhitespace(string: string): number {
  return string.search(/\S|$/)
}

export function markdownToTree(text: string): MindMapNode | undefined {
  const lines = text.split('\n')
  const nodesByLevel: Record<number, MindMapNode[]> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const whitespaceCount = countLeadingWhitespace(line)
    const level = whitespaceCount / LEVEL_INDENT.length

    if (i === 0 && level !== 0) {
      return undefined
    }

    if (i !== 0 && level === 0) {
      return undefined
    }

    if (i !== 0 && !line.slice(whitespaceCount).startsWith(LEAF_INDENT)) {
      return undefined
    }

    const parentLevel = level - 1

    if (level !== 0 && !(parentLevel in nodesByLevel)) {
      return undefined
    }

    const value =
      i === 0 ? line : line.slice(whitespaceCount + LEAF_INDENT.length)
    const node: MindMapNode = {
      children: [],
      value,
    }

    if (!(level in nodesByLevel)) {
      nodesByLevel[level] = []
    }

    if (level !== 0) {
      const parentNode =
        nodesByLevel[parentLevel][nodesByLevel[parentLevel].length - 1]

      if (!parentNode.children) {
        parentNode.children = []
      }

      parentNode.children.push(node)
    }
    nodesByLevel[level].push(node)
  }

  return nodesByLevel[0][0]
}
