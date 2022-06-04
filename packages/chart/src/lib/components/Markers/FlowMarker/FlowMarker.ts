import { computeLazy, observe, ReadonlySubject } from '@pavel/observable'
import { Lambda } from '@pavel/types'
import {
  ChartContext,
  InternalFlowMarker as InternalFlowMarkerType,
} from '../../../types'
import { mapDataToCoords } from '../../../util'
import { renderFlow } from '../../renderers'
import { Point } from '../../types'

type FlowMarkerProps = {
  readonly index: number
  readonly context: CanvasRenderingContext2D
  readonly marker: InternalFlowMarkerType
  readonly startIndex: ReadonlySubject<number>
  readonly endIndex: ReadonlySubject<number>
  readonly min: ReadonlySubject<number>
  readonly max: ReadonlySubject<number>
  readonly width: ReadonlySubject<number>
  readonly height: ReadonlySubject<number>
  readonly onChange: Lambda
}

export const FlowMarker = (
  {
    index,
    width,
    height,
    min,
    max,
    context,
    onChange,
    startIndex,
    endIndex,
    marker,
  }: FlowMarkerProps,
  { inertOpacityStateByMarkerIndex }: ChartContext,
) => {
  const series1 = computeLazy(
    [startIndex, endIndex, min, max, width, height],
    (startIndex, endIndex, min, max, width, height) => {
      return mapDataToCoords(
        marker.data[marker.lines[0].key],
        marker.domain,
        max,
        min,
        { width, height },
        {
          startIndex,
          endIndex,
        },
        marker.lines[0].lineWidth,
      )
    },
  )

  const series2 = computeLazy(
    [startIndex, endIndex, min, max, width, height],
    (startIndex, endIndex, min, max, width, height) => {
      return mapDataToCoords(
        marker.data[marker.lines[1].key],
        marker.domain,
        max,
        min,
        { width, height },
        {
          startIndex,
          endIndex,
        },
        marker.lines[1].lineWidth,
      )
    },
  )

  const opacity = computeLazy(
    [inertOpacityStateByMarkerIndex],
    inertOpacityStateByMarkerIndex => {
      return inertOpacityStateByMarkerIndex[index]
    },
  )

  observe([series1, series2, opacity], onChange, { collectValues: false })

  function rerender() {
    render(series1.get(), series2.get(), opacity.get())
  }

  function render(series1: Point[], series2: Point[], opacity: number) {
    renderFlow(
      context,
      series1,
      series2,
      marker.lines[0],
      marker.lines[1],
      opacity,
      marker.fill,
    )
  }

  return { render: rerender }
}
