import { ensureInBounds } from './ensureInBounds'

export function createPalette({
  hue,
  baseSaturation,
  lightnessSteps,
  name,
}: {
  hue: number
  baseSaturation: number
  lightnessSteps: number
  name: string
}) {
  const items = lightnessSteps
  const litMul = 100 / (items - 1)
  const range = Array.from({ length: items }, (_, index) => index)

  function privateCreatePalette() {
    const getAdjustedSaturation = (index: number) => {
      if (index < items / 2) {
        return baseSaturation * (Math.abs(index - items / 2) / (items / 2) + 1)
      }

      if (index === items / 2) {
        return baseSaturation
      }

      return (
        baseSaturation * ((Math.abs(index - items / 2) / (items / 2)) * 2 + 1)
      )
    }

    const result = []

    for (const index of range) {
      const h = hue
      const s = ensureInBounds(0, Math.round(getAdjustedSaturation(index)), 100)
      const l = ensureInBounds(0, Math.round(index * litMul), 100)

      result.push(`${h}deg ${s}% ${l}%`)
    }

    return result
    // return range.map(i => `hsl(228, ${saturation}%, ${i * litMul}%)`)
  }

  const properties: Record<string, string> = {}
  const colors = privateCreatePalette()

  for (let j = 0; j < colors.length; j++) {
    const color = colors[j]
    properties[`${name}-${Math.floor(j * litMul)}`] = color
  }

  return properties
}
