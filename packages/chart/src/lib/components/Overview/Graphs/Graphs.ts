import { effect, computeLazy, observe } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../../renderers'
import { ChartContext, ChartOptions } from '../../../types'
import { special } from '@pavel/easing'
import { mapDataToCoords, toBitMapSize } from '../../../util'
import { Transition } from '../../constants'
import { Point, Component } from '../../types'
import { createGraphs } from '../../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'

const VIEWBOX_TOP_BOTTOM_BORDER_WIDTH = 2

export const Graphs: Component<ChartOptions, ChartContext> = (
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
    globalMinMaxByGraphName,
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
      inertGlobalMax.setTransition(Transition.Medium)
      inertGlobalMin.setTransition(Transition.Medium)
    } else {
      inertGlobalMax.setTransition({
        duration: Transition.Slow,
        easing: special,
      })
      inertGlobalMin.setTransition({
        duration: Transition.Slow,
        easing: special,
      })
    }
  })

  const graphs = createDOM()

  scheduleTask(() => {
    renderPoints(
      overviewGraphPoints.value,
      inertOpacityStateByGraphName.value,
      inertGlobalMin.value,
      inertGlobalMax.value,
      globalMinMaxByGraphName.value,
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
        overviewGraphPoints.value,
        inertOpacityStateByGraphName.value,
        inertGlobalMin.value,
        inertGlobalMax.value,
        globalMinMaxByGraphName.value,
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
      globalMinMaxByGraphName,
    ],
    (
      overviewGraphPoints,
      inertOpacityStateByGraphName,
      inertGlobalMin,
      inertGlobalMax,
      // Should be inert
      globalMinMaxByGraphName,
    ) => {
      clearRect(
        graphs.context,
        toBitMapSize(width.value),
        toBitMapSize(canvasHeight),
      )
      renderPoints(
        overviewGraphPoints,
        inertOpacityStateByGraphName,
        inertGlobalMin,
        inertGlobalMax,
        globalMinMaxByGraphName,
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
      strokeStyles: options.colors,
      height: canvasHeight,
      width: width.value,
      lineJoinByName: options.lineJoin,
      lineCapByName: options.lineCap,
      min,
      max,
      minMaxByGraphName,
    })
  }

  return { element: graphs.element }

  function createDOM() {
    const graphs = createGraphs({
      width: width.value,
      height: canvasHeight,
    })
    graphs.element.style.marginTop = `${VIEWBOX_TOP_BOTTOM_BORDER_WIDTH}px`

    return graphs
  }
}
