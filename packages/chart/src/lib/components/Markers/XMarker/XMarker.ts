import { compute, observe, ReadonlySubject } from '@pavel/observable'
import { Lambda } from '@pavel/types'
import { Line } from '@pavel/utils'
import { InternalXMarker as XMarkerType } from '../../../types'
import { toBitMapSize, xToScreenX } from '../../../util'
import { renderLine } from '../../renderers'

type XMarkerProps = {
  context: CanvasRenderingContext2D
  marker: XMarkerType
  startX: ReadonlySubject<number>
  endX: ReadonlySubject<number>
  width: ReadonlySubject<number>
  height: ReadonlySubject<number>
  onChange: Lambda
}

export const XMarker = ({
  width,
  height,
  startX,
  endX,
  context,
  onChange,
  marker: { x, color, lineWidth },
}: XMarkerProps) => {
  const line = compute([startX, endX], (startX, endX) => {
    const screenX = xToScreenX(startX, endX, width.get(), x)

    return {
      x1: screenX,
      y1: 0,
      x2: screenX,
      y2: height.get(),
    } as Line
  })

  observe([line], onChange)

  function rerender() {
    render(line.get())
  }

  function render(line: Line) {
    renderLine(
      context,
      toBitMapSize(line.x1),
      toBitMapSize(line.y1),
      toBitMapSize(line.x2),
      toBitMapSize(line.y2),
      color,
      toBitMapSize(lineWidth),
    )
  }

  return { render: rerender }
}
