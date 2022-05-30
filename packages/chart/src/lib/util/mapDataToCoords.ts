import { ceil, floor, isInteger, interpolate } from '@pavel/utils'
import { Point } from '../components/types'

export type Points = {
  readonly xAt: (index: number) => number
  readonly yAt: (index: number) => number
  readonly set: (index: number, x: number, y: number) => void
  readonly length: number
}

function createPoints(length: number): Points {
  const xs = new Float64Array(length)
  const ys = new Float64Array(length)

  // function at(index: number): Point {
  //   return {
  //     x: xs[index],
  //     y: ys[index],
  //   }
  // }

  function xAt(index: number): number {
    return xs[index]
  }
  function yAt(index: number): number {
    return ys[index]
  }
  function set(index: number, x: number, y: number) {
    xs[index] = x
    ys[index] = y
  }

  return {
    xAt,
    yAt,
    set,
    length,
  }
}

export function mapDataToCoords(
  data: readonly number[],
  domain: readonly number[],
  max: number,
  min: number,
  { width, height: availableHeight }: { width: number; height: number },
  { startIndex, endIndex }: { startIndex: number; endIndex: number },
  lineWidth: number,
  // ): Point[] {
): Points {
  // console.time('mapDataToCoords')
  // half of the line width is subtracted from both sides
  // to prevent line trimming on the edges
  const lineWidthBuffer = lineWidth / 2
  const minY = lineWidthBuffer
  const maxY = availableHeight - lineWidthBuffer

  const isFirstPointEphemeral = !isInteger(startIndex)
  const isLastPointEphemeral = !isInteger(endIndex)
  const totalItems =
    floor(endIndex) -
    ceil(startIndex) +
    1 +
    Number(isFirstPointEphemeral) +
    Number(isLastPointEphemeral)

  // const coords: Point[] = new Array(totalItems)
  const points = createPoints(totalItems)

  let currentPointIndex = 0

  if (!isInteger(startIndex)) {
    const x = 0
    const y = toScreenY(
      min,
      max,
      minY,
      maxY,
      getValueAt(startIndex, domain, data),
    )

    // coords.push({ x, y })
    // coords[currentPointIndex++] = { x, y }
    points.set(currentPointIndex++, x, y)
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

    // coords.push({ x, y })
    // coords[currentPointIndex++] = { x, y }
    points.set(currentPointIndex++, x, y)
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

    // coords.push({ x, y })
    // coords[currentPointIndex] = { x, y }
    points.set(currentPointIndex++, x, y)
  }
  // console.timeEnd('mapDataToCoords')

  return points
}

function getValueAt(
  index: number,
  domain: readonly number[],
  values: readonly number[],
): number {
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
export function getX(xs: readonly number[], index: number): number {
  if (isInteger(index)) {
    return xs[index]
  }

  const left = floor(index)
  const right = ceil(index)

  return interpolate(left, right, xs[left], xs[right], index)
}

// TODO
// - Replace `toScreenX` with `xToScreenX`
export function toScreenX(
  xs: readonly number[],
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

export function xToScreenX(
  startX: number,
  endX: number,
  width: number,
  x: number,
) {
  return interpolate(startX, endX, 0, width, x)
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
