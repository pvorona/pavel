export function interpolate<T extends number>(
  x1: number,
  x2: number,
  y1: T,
  y2: T,
  x: number,
): T {
  if (x === x2) {
    return y2
  }

  if (x1 === x2) {
    return y2
  }
  
  return (((y2 - y1) / (x2 - x1)) * (x - x1) + y1) as T
}
