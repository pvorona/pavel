import { interpolate } from '@pavel/utils'
import { Point } from '../components/types'
import { ceil, floor, isInteger } from './math'

export function mapDataToCoords(
  data: number[],
  domain: number[],
  max: number,
  min: number,
  { width, height: availableHeight }: { width: number; height: number },
  { startIndex, endIndex }: { startIndex: number; endIndex: number },
  lineWidth: number,
): Point[] {
  // half of the line width is subtracted from both sides
  // to prevent line trimming on the edges
  const lineWidthBuffer = lineWidth / 2
  const minY = lineWidthBuffer
  const maxY = availableHeight - lineWidthBuffer
  const coords: Point[] = []

  if (!isInteger(startIndex)) {
    const x = 0
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      getValueAt(startIndex, domain, data),
    )

    coords.push({ x, y })
  }

  for (
    let currentIndex = ceil(startIndex);
    currentIndex <= floor(endIndex);
    currentIndex++
  ) {
    const x = toScreenX(domain, width, startIndex, endIndex, currentIndex)
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      getValueAt(currentIndex, domain, data),
    )

    coords.push({ x, y })
  }

  if (!isInteger(endIndex)) {
    const x = width
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      getValueAt(endIndex, domain, data),
    )

    coords.push({ x, y })
  }

  return coords
}

function getValueAt(index: number, domain: number[], values: number[]): number {
  if (isInteger(index)) {
    return values[index]
  }

  const left = floor(index)
  const right = ceil(index)
  const leftX = domain[left]
  const rightX = domain[right]
  const x = getX(domain, index)

  return interpolate(leftX, rightX, values[left], values[right], x)
}

// Gets x by fractional index
export function getX(xs: number[], index: number): number {
  if (isInteger(index)) {
    return xs[index]
  }

  const left = floor(index)
  const right = ceil(index)

  return interpolate(left, right, xs[left], xs[right], index)
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
