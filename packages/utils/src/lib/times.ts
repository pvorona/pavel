export function times<T>(n: number, callback: (value: number) => T): T[] {
  const result = new Array(n)

  for (let i = 0; i < n; i++) {
    result[i] = callback(i)
  }

  return result
}
