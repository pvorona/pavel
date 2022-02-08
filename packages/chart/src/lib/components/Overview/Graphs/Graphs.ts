import { effect, computeLazy, observe, transition } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../../renderers'
import { ChartContext, ChartOptions } from '../../../types'
import { easeInOutQuart, linear } from '../../../easings'
import { mapDataToCoords, toBitMapSize } from '../../../util'
import { FAST_TRANSITIONS_TIME, LONG_TRANSITIONS_TIME } from '../../constants'
import { Point, Component } from '../../types'
import { createGraphs } from '../../Graphs/createGraphs'

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
              width: width,
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
      inertGlobalMax.setTransition(
        transition(inertGlobalMax.get(), FAST_TRANSITIONS_TIME, linear),
      )
      inertGlobalMin.setTransition(
        transition(inertGlobalMin.get(), FAST_TRANSITIONS_TIME, linear),
      )
    } else {
      inertGlobalMax.setTransition(
        transition(inertGlobalMax.get(), LONG_TRANSITIONS_TIME, easeInOutQuart),
      )
      inertGlobalMin.setTransition(
        transition(inertGlobalMin.get(), LONG_TRANSITIONS_TIME, easeInOutQuart),
      )
    }
  })

  const graphs = createDOM()

  renderPoints(overviewGraphPoints.get(), inertOpacityStateByGraphName.get())

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
      )
    },
    { fireImmediately: false },
  )

  effect(
    [overviewGraphPoints, inertOpacityStateByGraphName],
    (overviewGraphPoints, inertOpacityStateByGraphName) => {
      clearRect(
        graphs.context,
        toBitMapSize(width.get()),
        toBitMapSize(canvasHeight),
      )
      renderPoints(overviewGraphPoints, inertOpacityStateByGraphName)
    },
    { fireImmediately: false },
  )

  function renderPoints(
    overviewGraphPoints: { [key: string]: Point[] },
    inertOpacityStateByGraphName: { [key: string]: number },
  ) {
    renderLineSeriesWithAreaGradient({
      opacityState: inertOpacityStateByGraphName,
      points: overviewGraphPoints,
      context: graphs.context,
      graphNames: options.graphNames,
      lineWidth: options.overview.lineWidth,
      strokeStyles: options.colors,
      height: canvasHeight,
      width: width.get(),
      // Use `miter` line join in overview?
      lineJoinByName: options.lineJoin,
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