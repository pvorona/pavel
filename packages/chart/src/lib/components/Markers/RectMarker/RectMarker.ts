import { computeLazy, observe, ReadonlySubject } from '@pavel/observable'
import { Lambda } from '@pavel/types'
import { interpolate, Rect } from '@pavel/utils'
import {
  ChartContext,
  InternalRectMarker as RectMarkerType,
} from '../../../types'
import { toBitMapSize, toScreenY, xToScreenX } from '../../../util'
import { applyAlpha } from '../../../util/color'
import { fillRect, strokeRect } from '../../renderers'

type RectMarkerProps = {
  readonly index: number
  readonly context: CanvasRenderingContext2D
  readonly marker: RectMarkerType
  readonly startX: ReadonlySubject<number>
  readonly endX: ReadonlySubject<number>
  readonly min: ReadonlySubject<number>
  readonly max: ReadonlySubject<number>
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly onChange: Lambda
}

export const RectMarker = (
  {
    index,
    startX,
    endX,
    width,
    height,
    min,
    max,
    context,
    marker,
    onChange,
  }: RectMarkerProps,
  { inertOpacityStateByMarkerIndex }: ChartContext,
) => {
  const rect = computeLazy(
    [startX, endX, min, max],
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
      } as const
    },
  )

  const opacity = computeLazy(
    [inertOpacityStateByMarkerIndex],
    inertOpacityStateByMarkerIndex => {
      return inertOpacityStateByMarkerIndex[index]
    },
  )

  observe([rect, opacity], onChange, { collectValues: false })

  function rerender() {
    render(rect.get(), opacity.get())
  }

  function render(rect: Rect, opacity: number) {
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

    if (opacity === 0) {
      return
    }

    const boundedMinX = Math.max(rect.x, minX)
    const boundedMaxX = Math.min(rect.x + rect.width, maxX)
    const boundedWidth = boundedMaxX - boundedMinX
    const boundedMinY = Math.max(rect.y, minY)
    const boundedMaxY = Math.min(rect.y + rect.height, maxY)
    const boundedHeight = boundedMaxY - boundedMinY

    const fill = applyAlpha(marker.fill, opacity)
    const stroke = applyAlpha(marker.stroke, opacity)

    fillRect(
      context,
      toBitMapSize(boundedMinX),
      toBitMapSize(boundedMinY),
      toBitMapSize(boundedWidth),
      toBitMapSize(boundedHeight),
      fill,
    )

    strokeRect(
      context,
      toBitMapSize(boundedMinX),
      toBitMapSize(boundedMinY),
      toBitMapSize(boundedWidth),
      toBitMapSize(boundedHeight),
      stroke,
      toBitMapSize(marker.lineWidth),
    )
  }

  return { render: rerender }
}
