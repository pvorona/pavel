import { getOrCreate } from '@pavel/cache'

const indexByGroup: Record<string, number> = {}

export function createName(
  groupName: string,
  options?: { name?: string } | number,
): string {
  if (typeof options === 'object' && options !== null && options.name) {
    return options.name
  }

  const index = getOrCreate(indexByGroup, groupName, 0)

  indexByGroup[groupName]++

  return `[${groupName}#${index}]`
}

export function wrapName(wrapperName: string, childName: string): string {
  return `[${wrapperName}(${childName})]`
}
