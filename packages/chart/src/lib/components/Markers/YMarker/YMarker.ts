import {
  compute,
  computeLazy,
  observe,
  ReadonlySubject,
} from '@pavel/observable'
import { Lambda } from '@pavel/types'
import { Line } from '@pavel/utils'
import { ChartContext, InternalYMarker as YMarkerType } from '../../../types'
import { toBitMapSize, toScreenY } from '../../../util'
import { applyCanvasStyle, renderLine } from '../../renderers'

type YMarkerProps = {
  readonly index: number
  readonly context: CanvasRenderingContext2D
  readonly marker: YMarkerType
  readonly minY: ReadonlySubject<number>
  readonly maxY: ReadonlySubject<number>
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly onChange: Lambda
}

export const YMarker = (
  {
    index,
    width,
    height,
    minY,
    maxY,
    context,
    onChange,
    marker: { y, strokeStyle, lineWidth, lineDash },
  }: YMarkerProps,
  { inertOpacityStateByMarkerIndex }: ChartContext,
) => {
  const line = compute(
    [minY, maxY, width, height],
    (minY, maxY, width, height) => {
      const screenY = toScreenY(minY, maxY, 0, height, y)

      return {
        x1: 0,
        y1: screenY,
        x2: width,
        y2: screenY,
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
    applyCanvasStyle(context, {
      strokeStyle,
      opacity,
      lineWidth,
      lineDash,
    })

    renderLine(
      context,
      toBitMapSize(line.x1),
      toBitMapSize(line.y1),
      toBitMapSize(line.x2),
      toBitMapSize(line.y2),
    )
  }

  return { render: rerender }
}
