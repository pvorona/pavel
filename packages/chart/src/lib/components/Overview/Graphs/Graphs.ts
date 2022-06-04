import { effect, computeLazy, observe } from '@pavel/observable'
import { clearRect, renderSeries, setCanvasSize } from '../../renderers'
import { ChartContext, InternalChartOptions } from '../../../types'
import { special } from '@pavel/easing'
import { mapDataToCoords, toBitMapSize } from '../../../util'
import { TRANSITION } from '../../constants'
import { Point, Component } from '../../types'
import { createGraphs } from '../../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'
import { getByRingIndex } from '@pavel/utils'

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
    renderPoints(overviewGraphPoints.get(), inertOpacityStateByGraphKey.get())
  })

  effect(
    [width],
    width => {
      setCanvasSize(
        graphs.canvas,
        toBitMapSize(width),
        toBitMapSize(canvasHeight),
      )
      renderPoints(overviewGraphPoints.get(), inertOpacityStateByGraphKey.get())
    },
    { fireImmediately: false },
  )

  effect(
    [overviewGraphPoints, inertOpacityStateByGraphKey],
    (overviewGraphPoints, inertOpacityStateByGraphKey) => {
      clearRect(
        graphs.context,
        0,
        0,
        toBitMapSize(width.get()),
        toBitMapSize(canvasHeight),
      )
      renderPoints(overviewGraphPoints, inertOpacityStateByGraphKey)
    },
    { fireImmediately: false },
  )

  function renderPoints(
    points: { [key: string]: Point[] },
    opacityByGraphKey: { [key: string]: number },
  ) {
    for (let index = 0; index < options.graphs.length; index++) {
      const graph = options.graphs[index]
      const strokeStyle = getByRingIndex(options.colors, index)

      renderSeries(
        graphs.context,
        points[graph.key],
        strokeStyle,
        opacityByGraphKey[graph.key],
        options.lineWidth,
        options.lineJoin,
        options.lineCap,
      )
    }
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
