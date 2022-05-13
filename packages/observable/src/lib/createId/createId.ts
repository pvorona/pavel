import { getOrInitMap } from '@pavel/utils'
import { Identifiable } from '../types'

const countByGroup = new Map<string, number>()

export function createId(
  groupName: string,
  options?: Partial<Identifiable> | number,
  id?: string,
): string {
  if (typeof options === 'object' && options.id) {
    return options.id
  }

  if (id) {
    return id
  }

  const index = getOrInitMap(countByGroup, groupName, 0)

  countByGroup.set(groupName, index + 1)

  return `[${groupName}#${index}]`
}

export function wrapId(wrapperName: string, childName: string): string {
  return `[${wrapperName}(${childName})]`
}
