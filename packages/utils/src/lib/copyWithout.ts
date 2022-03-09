export function copyWithout<T>(array: T[], item: T): T[] {
  return array.filter(element => element !== item)
}
