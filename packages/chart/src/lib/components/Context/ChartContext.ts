import {
  effect,
  observable,
  computeLazy,
  observe,
  resetWhenInactive,
  inert,
  compute,
} from '@pavel/observable'
import { InternalChartOptions } from '../../types'
import {
  cursor,
  TRANSITION,
  MIN_HEIGHT,
  WHEEL_CLEAR_TIMEOUT,
} from '../constants'
import { OpacityState, Point, EnabledGraphNames } from '../types'
import { mapDataToCoords, createMinMaxView, areNumbersClose } from '../../util'
import { special } from '@pavel/easing'
import { xToIndex } from '../../util/xToIndex'
import { ensureInBounds } from '@pavel/utils'
import { getDomainValueAt, getTotalItems } from '../../config'

export const ChartContext = (options: InternalChartOptions) => {
  const globalStartIndex = observable(0, {
    id: 'globalStartIndex',
  })
  const globalEndIndex = observable(options.total - 1, {
    id: 'globalEndIndex',
  })
  const width = observable(options.width, { id: 'width' })
  const height = observable(options.height, { id: 'height' })
  const canvasHeight = compute([height], computeCanvasHeight, {
    id: 'canvasHeight',
  })
  const startX = observable(options.viewBox.start, {
    id: 'startX',
    is: areNumbersClose,
    set: (newValue, { set }) => {
      const boundedValue = ensureInBounds(
        newValue,
        getDomainValueAt(options, 0),
        getDomainValueAt(options, getTotalItems(options) - 1),
      )

      set(boundedValue)
    },
  })
  const endX = observable(options.viewBox.end, {
    id: 'endX',
    is: areNumbersClose,
    set: (newValue, { set }) => {
      const boundedValue = ensureInBounds(
        newValue,
        getDomainValueAt(options, 0),
        getDomainValueAt(options, getTotalItems(options) - 1),
      )

      set(boundedValue)
    },
  })

  const inertStartX = inert({ duration: TRANSITION.FAST, target: startX })
  const inertEndX = inert({ duration: TRANSITION.FAST, target: endX })

  const startIndex = computeLazy(
    // TODO
    // [inertStartX],
    [startX],
    inertStartX => {
      return xToIndex(options.domain, inertStartX)
    },
    {
      id: 'startIndex',
    },
  )

  const endIndex = computeLazy(
    // TODO
    // [inertEndX],
    [endX],
    inertEndX => {
      return xToIndex(options.domain, inertEndX)
    },
    {
      id: 'endIndex',
    },
  )

  const mouseX = observable(0, { id: 'mouseX' })
  const isHovering = observable(false, { id: 'isHovering' })
  const isDragging = observable(false, { id: 'isDragging' })
  const isGrabbingGraphs = observable(false, { id: 'isGrabbingGraphs' })
  const isWheeling = resetWhenInactive(WHEEL_CLEAR_TIMEOUT)(
    observable(false, { id: 'isWheeling' }),
  )
  const activeCursor = observable(cursor.default, { id: 'activeCursor' })
  const enabledStateByGraphName = observable(
    options.graphs.reduce(
      (state, graph) => ({
        ...state,
        [graph.key]: options.visibility[graph.key],
      }),
      {} as EnabledGraphNames,
    ),
    { id: 'enabledStateByGraphName' },
  )

  function computeCanvasHeight(containerHeight: number) {
    return Math.max(
      containerHeight -
        options.overview.height -
        options.x.label.fontSize -
        options.x.margin.blockEnd -
        options.x.margin.blockStart,
      MIN_HEIGHT,
    )
  }

  const enabledGraphKeys = computeLazy(
    [enabledStateByGraphName],
    function enabledGraphNamesCompute(enabledStateByGraphName) {
      return options.graphs
        .filter(graph => enabledStateByGraphName[graph.key])
        .map(graph => graph.key)
    },
  )

  const isAnyGraphEnabled = computeLazy(
    [enabledGraphKeys],
    enabledGraphNames => {
      return enabledGraphNames.length !== 0
    },
  )

  const {
    minMaxByGraphName: visibleMinMaxByGraphName,
    min: visibleMin,
    max: visibleMax,
  } = createMinMaxView(
    startIndex,
    endIndex,
    enabledGraphKeys,
    options.graphs,
    options.data,
  )

  const inertVisibleMax = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: visibleMax,
  })

  const inertVisibleMin = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: visibleMin,
  })

  const inertVisibleMinMaxByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: visibleMinMaxByGraphName,
  })

  const {
    max: globalMax,
    min: globalMin,
    minMaxByGraphName: globalMinMaxByGraphName,
  } = createMinMaxView(
    globalStartIndex,
    globalEndIndex,
    enabledGraphKeys,
    options.graphs,
    options.data,
  )

  const inertGlobalMax = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: globalMax,
  })

  const inertGlobalMin = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: globalMin,
  })

  const inertGlobalMinMaxByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: globalMinMaxByGraphName,
  })

  // why lazy
  const opacityStateByGraphName = computeLazy(
    [enabledStateByGraphName],
    function opacityStateByGraphNameCompute(enabledStateByGraphName) {
      return options.graphs.reduce(
        (state, graph) => ({
          ...state,
          [graph.key]: Number(enabledStateByGraphName[graph.key]),
        }),
        {} as OpacityState,
      )
    },
  )

  const inertOpacityStateByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: opacityStateByGraphName,
  })

  const mainGraphPoints = computeLazy(
    [
      startIndex,
      endIndex,
      inertVisibleMax,
      inertVisibleMin,
      width,
      canvasHeight,
    ],
    function computeVisibleSeriesPoints(
      startIndex,
      endIndex,
      max,
      min,
      width,
      canvasHeight,
    ) {
      return options.graphs.reduce(
        (points, graph) => ({
          ...points,
          [graph.key]: mapDataToCoords(
            options.data[graph.key],
            options.domain,
            max,
            min,
            {
              width: width,
              height: canvasHeight,
            },
            { startIndex, endIndex },
            options.lineWidth,
          ),
        }),
        {} as { [key: string]: Point[] },
      )
    },
  )

  observe(
    [isDragging, isWheeling, isGrabbingGraphs],
    (isDragging, isWheeling, isGrabbingGraphs) => {
      if (isDragging || isWheeling || isGrabbingGraphs) {
        // Linear easing when moving
        inertVisibleMax.setTransition(TRANSITION.MEDIUM)
        inertVisibleMin.setTransition(TRANSITION.MEDIUM)
        inertVisibleMinMaxByGraphName.setTransition(TRANSITION.MEDIUM)
      } else {
        inertVisibleMax.setTransition({
          duration: TRANSITION.SLOW,
          easing: special,
        })
        inertVisibleMin.setTransition({
          duration: TRANSITION.SLOW,
          easing: special,
        })
        inertVisibleMinMaxByGraphName.setTransition({
          duration: TRANSITION.SLOW,
          easing: special,
        })
      }
    },
  )

  effect([activeCursor], activeCursor => {
    if (activeCursor !== cursor.default) {
      document.body.classList.add(activeCursor)

      return () => {
        document.body.classList.remove(activeCursor)
      }
    }
  })

  return {
    startX,
    endX,
    isHovering,
    isDragging,
    isWheeling,
    isGrabbingGraphs,
    activeCursor,
    enabledStateByGraphName,
    enabledGraphKeys,
    isAnyGraphEnabled,
    mainGraphPoints,
    startIndex,
    endIndex,
    mouseX,
    inertOpacityStateByGraphName,
    visibleMax,
    visibleMin,
    width,
    canvasHeight,
    height,
    globalMax,
    globalMin,
    inertGlobalMax,
    inertGlobalMin,
    globalMinMaxByGraphName,
    visibleMinMaxByGraphName,
    inertVisibleMinMaxByGraphName,
    inertGlobalMinMaxByGraphName,
    globalStartIndex,
    globalEndIndex,
    inertVisibleMax,
    inertVisibleMin,
    inertStartX,
    inertEndX,
  }
}
