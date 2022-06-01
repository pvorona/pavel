import {
  compute,
  computeLazy,
  observe,
  ReadonlySubject,
} from '@pavel/observable'
import { Lambda } from '@pavel/types'
import { Line } from '@pavel/utils'
import { ChartContext, InternalXMarker as XMarkerType } from '../../../types'
import { toBitMapSize, toScreenX } from '../../../util'
import { applyAlpha } from '../../../util/color'
import { renderLine } from '../../renderers'

type XMarkerProps = {
  readonly index: number
  readonly context: CanvasRenderingContext2D
  readonly marker: XMarkerType
  readonly startX: ReadonlySubject<number>
  readonly endX: ReadonlySubject<number>
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly onChange: Lambda
}

export const XMarker = (
  {
    index,
    width,
    height,
    startX,
    endX,
    context,
    onChange,
    marker: { x, color, lineWidth },
  }: XMarkerProps,
  { inertOpacityStateByMarkerIndex }: ChartContext,
) => {
  const line = compute(
    [startX, endX, width, height],
    (startX, endX, width, height) => {
      const screenX = toScreenX(startX, endX, 0, width, x)

      return {
        x1: screenX,
        y1: 0,
        x2: screenX,
        y2: height,
      } as Line
    },
  )

  const opacity = computeLazy(
    [inertOpacityStateByMarkerIndex],
    inertOpacityStateByMarkerIndex => {
      return inertOpacityStateByMarkerIndex[index]
    },
  )

  observe([line, opacity], onChange, { collectValues: false })

  function rerender() {
    render(line.get(), opacity.get())
  }

  function render(line: Line, opacity: number) {
    const colorWithOpacity = applyAlpha(color, opacity)

    renderLine(
      context,
      toBitMapSize(line.x1),
      toBitMapSize(line.y1),
      toBitMapSize(line.x2),
      toBitMapSize(line.y2),
      colorWithOpacity,
      toBitMapSize(lineWidth),
    )
  }

  return { render: rerender }
}
