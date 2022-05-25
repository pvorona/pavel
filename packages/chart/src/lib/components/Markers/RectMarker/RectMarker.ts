import { compute, observe, ReadonlySubject } from '@pavel/observable'
import { Lambda } from '@pavel/types'
import { interpolate, Rect } from '@pavel/utils'
import { InternalRectMarker as RectMarkerType } from '../../../types'
import { toBitMapSize, toScreenY, xToScreenX } from '../../../util'
import { fillRect } from '../../renderers'

type RectMarkerProps = {
  context: CanvasRenderingContext2D
  marker: RectMarkerType
  startX: ReadonlySubject<number>
  endX: ReadonlySubject<number>
  min: ReadonlySubject<number>
  max: ReadonlySubject<number>
  width: ReadonlySubject<number>
  height: ReadonlySubject<number>
  onChange: Lambda
}

export const RectMarker = ({
  startX,
  endX,
  width,
  height,
  min,
  max,
  context,
  marker,
  onChange,
}: RectMarkerProps) => {
  const rect = compute(
    [startX, endX, min, max, height],
    (startX, endX, min, max) => {
      const screenX = xToScreenX(startX, endX, width.get(), marker.x)
      const screenY = toScreenY(min, max, 0, height.get(), marker.y)
      const screenWidth = interpolate(
        startX,
        endX,
        0,
        width.get(),
        startX + marker.width,
      )
      const screenHeight = interpolate(
        min,
        max,
        0,
        height.get(),
        min + marker.height,
      )

      return {
        x: screenX,
        y: screenY,
        width: screenWidth,
        height: screenHeight,
      } as Rect
    },
  )

  observe([rect], onChange)

  function rerender() {
    render(rect.get())
  }

  function render(rect: Rect) {
    const minX = 0
    const maxX = width.get()
    const minY = 0
    const maxY = height.get()

    if (rect.x + rect.width <= minX) {
      return
    }

    if (rect.x >= maxX) {
      return
    }

    if (rect.y + rect.height <= minY) {
      return
    }

    if (rect.y >= maxY) {
      return
    }

    const boundedMinX = Math.max(rect.x, minX)
    const boundedMaxX = Math.min(rect.x + rect.width, maxX)
    const boundedWidth = boundedMaxX - boundedMinX
    const boundedMinY = Math.max(rect.y, minY)
    const boundedMaxY = Math.min(rect.y + rect.height, maxY)
    const boundedHeight = boundedMaxY - boundedMinY

    fillRect(
      context,
      toBitMapSize(boundedMinX),
      toBitMapSize(boundedMinY),
      toBitMapSize(boundedWidth),
      toBitMapSize(boundedHeight),
      marker.fill,
    )
  }

  return { render: rerender }
}
