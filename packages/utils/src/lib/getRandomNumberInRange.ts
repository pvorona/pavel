export function getRandomNumberInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}
