import { getOrInitV2 } from '@pavel/utils'

const countByGroup = new Map<string, number>()

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

  const index = getOrInitV2(countByGroup, groupName, 0)

  countByGroup.set(groupName, index + 1)

  return `[${groupName}#${index}]`
}

export function wrapName(wrapperName: string, childName: string): string {
  return `[${wrapperName}(${childName})]`
}
