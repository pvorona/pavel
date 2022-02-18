import { getOrInit } from '@pavel/utils'

const countByGroup: Record<string, number> = {}

export function createName(
  groupName: string,
  options?: { name?: string } | number,
  name?: string,
): string {
  if (typeof options === 'object' && options.name) {
    return options.name
  }

  if (name) {
    return name
  }

  const index = getOrInit(countByGroup, groupName, 0)

  countByGroup[groupName]++

  return `[${groupName}#${index}]`
}

export function wrapName(wrapperName: string, childName: string): string {
  return `[${wrapperName}(${childName})]`
}
