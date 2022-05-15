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
    inertOpacityStateByGraphName,
    inertGlobalMinMaxByGraphName,
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
      return options.graphNames.reduce(
        (points, graphName) => ({
          ...points,
          [graphName]: mapDataToCoords(
            options.data[graphName],
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
      inertGlobalMinMaxByGraphName.setTransition(TRANSITION.MEDIUM)
    } else {
      inertGlobalMax.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
      inertGlobalMin.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
      inertGlobalMinMaxByGraphName.setTransition({
        duration: TRANSITION.SLOW,
        easing: special,
      })
    }
  })

  const graphs = createDOM()

  scheduleTask(() => {
    renderPoints(
      overviewGraphPoints.get(),
      inertOpacityStateByGraphName.get(),
      inertGlobalMin.get(),
      inertGlobalMax.get(),
      inertGlobalMinMaxByGraphName.get(),
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
        inertOpacityStateByGraphName.get(),
        inertGlobalMin.get(),
        inertGlobalMax.get(),
        inertGlobalMinMaxByGraphName.get(),
      )
    },
    { fireImmediately: false },
  )

  effect(
    [
      overviewGraphPoints,
      inertOpacityStateByGraphName,
      inertGlobalMin,
      inertGlobalMax,
      inertGlobalMinMaxByGraphName,
    ],
    (
      overviewGraphPoints,
      inertOpacityStateByGraphName,
      inertGlobalMin,
      inertGlobalMax,
      inertGlobalMinMaxByGraphName,
    ) => {
      clearRect(
        graphs.context,
        toBitMapSize(width.get()),
        toBitMapSize(canvasHeight),
      )
      renderPoints(
        overviewGraphPoints,
        inertOpacityStateByGraphName,
        inertGlobalMin,
        inertGlobalMax,
        inertGlobalMinMaxByGraphName,
      )
    },
    { fireImmediately: false },
  )

  function renderPoints(
    overviewGraphPoints: { [key: string]: Point[] },
    inertOpacityStateByGraphName: { [key: string]: number },
    min: number,
    max: number,
    minMaxByGraphName: Record<string, { min: number; max: number }>,
  ) {
    renderLineSeriesWithAreaGradient({
      opacityState: inertOpacityStateByGraphName,
      points: overviewGraphPoints,
      context: graphs.context,
      graphNames: options.graphNames,
      lineWidth: options.overview.lineWidth,
      colors: options.colors,
      height: canvasHeight,
      width: width.get(),
      lineJoin: options.lineJoin,
      lineCap: options.lineCap,
      min,
      max,
      minMaxByGraphName,
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
