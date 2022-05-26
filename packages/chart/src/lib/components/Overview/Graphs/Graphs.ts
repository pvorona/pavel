import { effect, computeLazy, observe } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../../renderers'
import { ChartContext, InternalChartOptions } from '../../../types'
import { special } from '@pavel/easing'
import { mapDataToCoords, toBitMapSize } from '../../../util'
import { TRANSITION } from '../../constants'
import { Point, Component } from '../../types'
import { createGraphs } from '../../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'

const VIEWBOX_TOP_BOTTOM_BORDER_WIDTH = 2

export const Graphs: Component<InternalChartOptions, ChartContext> = (
  options,
  context,
) => {
  const {
    isDragging,
    isWheeling,
    width,
    globalStartIndex,
    globalEndIndex,
    inertGlobalMax,
    inertGlobalMin,
    inertOpacityStateByGraphKey,
    inertGlobalMinMaxByGraphKey,
  } = context

  const canvasHeight =
    options.overview.height - 2 * VIEWBOX_TOP_BOTTOM_BORDER_WIDTH

  const overviewGraphPoints = computeLazy(
    [globalStartIndex, globalEndIndex, inertGlobalMax, inertGlobalMin, width],
    (
      globalStartIndex,
      globalEndIndex,
      inertGlobalMax,
      inertGlobalMin,
      width,
    ) => {
      return options.graphs.reduce(
        (points, graph) => ({
          ...points,
          [graph.key]: mapDataToCoords(
            options.data[graph.key],
            options.domain,
            inertGlobalMax,
            inertGlobalMin,
            {
              width,
              height: canvasHeight,
            },
            { startIndex: globalStartIndex, endIndex: globalEndIndex },
            options.lineWidth,
          ),
        }),
        {} as { [key: string]: Point[] },
      )
    },
  )

  observe([isDragging, isWheeling], (isDragging, isWheeling) => {
    if (isDragging || isWheeling) {
      inertGlobalMax.setTransition(TRANSITION.MEDIUM)
      inertGlobalMin.setTransition(TRANSITION.MEDIUM)
      inertGlobalMinMaxByGraphKey.setTransition(TRANSITION.MEDIUM)
    } else {
      inertGlobalMax.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
      inertGlobalMin.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
      inertGlobalMinMaxByGraphKey.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
    }
  })

  const graphs = createDOM()

  scheduleTask(() => {
    renderPoints(
      overviewGraphPoints.get(),
      inertOpacityStateByGraphKey.get(),
      inertGlobalMin.get(),
      inertGlobalMax.get(),
      inertGlobalMinMaxByGraphKey.get(),
    )
  })

  effect(
    [width],
    width => {
      setCanvasSize(
        graphs.canvas,
        toBitMapSize(width),
        toBitMapSize(canvasHeight),
      )
      renderPoints(
        overviewGraphPoints.get(),
        inertOpacityStateByGraphKey.get(),
        inertGlobalMin.get(),
        inertGlobalMax.get(),
        inertGlobalMinMaxByGraphKey.get(),
      )
    },
    { fireImmediately: false },
  )

  effect(
    [
      overviewGraphPoints,
      inertOpacityStateByGraphKey,
      inertGlobalMin,
      inertGlobalMax,
      inertGlobalMinMaxByGraphKey,
    ],
    (
      overviewGraphPoints,
      inertOpacityStateByGraphKey,
      inertGlobalMin,
      inertGlobalMax,
      inertGlobalMinMaxByGraphKey,
    ) => {
      clearRect(
        graphs.context,
        0,
        0,
        toBitMapSize(width.get()),
        toBitMapSize(canvasHeight),
      )
      renderPoints(
        overviewGraphPoints,
        inertOpacityStateByGraphKey,
        inertGlobalMin,
        inertGlobalMax,
        inertGlobalMinMaxByGraphKey,
      )
    },
    { fireImmediately: false },
  )

  function renderPoints(
    overviewGraphPoints: { [key: string]: Point[] },
    inertOpacityStateByGraphKey: { [key: string]: number },
    min: number,
    max: number,
    minMaxByGraphKey: Record<string, { min: number; max: number }>,
  ) {
    renderLineSeriesWithAreaGradient({
      opacityState: inertOpacityStateByGraphKey,
      points: overviewGraphPoints,
      context: graphs.context,
      graphs: options.graphs,
      lineWidth: options.overview.lineWidth,
      colors: options.colors,
      height: canvasHeight,
      width: width.get(),
      lineJoin: options.lineJoin,
      lineCap: options.lineCap,
      min,
      max,
      minMaxByGraphKey,
      gradient: options.gradient,
    })
  }

  return { element: graphs.element }

  function createDOM() {
    const graphs = createGraphs({
      width: width.get(),
      height: canvasHeight,
    })
    graphs.element.style.marginTop = `${VIEWBOX_TOP_BOTTOM_BORDER_WIDTH}px`

    return graphs
  }
}
