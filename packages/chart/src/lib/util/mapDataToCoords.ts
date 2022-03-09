import { Point } from '../components/types'
import { interpolate, interpolatePoint } from './interpolatePoint'
import { ceil } from './math'

export function mapDataToCoords(
  data: number[],
  domain: number[],
  max: number,
  min: number,
  { width, height: availableHeight }: { width: number; height: number },
  { startIndex, endIndex }: { startIndex: number; endIndex: number },
  lineWidth: number,
): Point[] {
  // half of the line width is deducted from both sides
  // to prevent line trimming on the edges
  const lineWidthBuffer = lineWidth / 2
  const minY = lineWidthBuffer
  const maxY = availableHeight - lineWidthBuffer
  const coords: Point[] = []

  if (!Number.isInteger(startIndex)) {
    const x = 0
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      interpolatePoint(startIndex, data),
    )

    coords.push({ x, y })
  }

  for (
    let currentIndex = ceil(startIndex);
    currentIndex <= Math.floor(endIndex);
    currentIndex++
  ) {
    const x = toScreenX(domain, width, startIndex, endIndex, currentIndex)
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      interpolatePoint(currentIndex, data),
    )

    coords.push({ x, y })
  }

  if (!Number.isInteger(endIndex)) {
    const x = width
    const y = toScreenY(min, max, minY, maxY, interpolatePoint(endIndex, data))

    coords.push({ x, y })
  }

  return coords
}

// Gets x by fractional index
function getX(xs: number[], index: number): number {
  if (Number.isInteger(index)) {
    return xs[index]
  }

  return (
    (xs[ceil(index)] - xs[Math.floor(index)]) * (index % 1) +
    xs[Math.floor(index)]
  )
}

export function toScreenX(
  xs: number[],
  width: number,
  startIndex: number,
  endIndex: number,
  currentIndex: number,
) {
  return interpolate(
    getX(xs, startIndex),
    getX(xs, endIndex),
    0,
    width,
    getX(xs, currentIndex),
  )
}

export function toScreenY(
  minValue: number,
  maxValue: number,
  minY: number,
  maxY: number,
  value: number,
) {
  return interpolate(maxValue, minValue, minY, maxY, value)
}
