import { getOrCreate } from '@pavel/cache'

const countByGroup: Record<string, number> = {}

export function createName(
  groupName: string,
  options?: { name?: string } | number,
): string {
  if (typeof options === 'object' && options.name) {
    return options.name
  }

  const index = getOrCreate(countByGroup, groupName, 0)

  countByGroup[groupName]++

  return `[${groupName}#${index}]`
}

export function wrapName(wrapperName: string, childName: string): string {
  return `[${wrapperName}(${childName})]`
}
