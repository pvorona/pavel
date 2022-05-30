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
import { OpacityState, Point, EnabledGraphKeys } from '../types'
import {
  mapDataToCoords,
  createMinMaxView,
  areNumbersClose,
  Points,
} from '../../util'
import { special } from '@pavel/easing'
import { xToIndex } from '../../util/xToIndex'
import { ensureInBounds } from '@pavel/utils'

export const ChartContext = (options: InternalChartOptions) => {
  const globalStartX = observable(options.domain[0], {
    id: 'globalStartX',
  })
  const globalEndX = observable(options.domain[options.domain.length - 1], {
    id: 'globalEndX',
  })
  const globalStartIndex = compute(
    [globalStartX],
    globalStartX => xToIndex(options.domain, globalStartX),
    {
      id: 'globalStartIndex',
    },
  )
  const globalEndIndex = compute(
    [globalEndX],
    globalEndX => xToIndex(options.domain, globalEndX),
    {
      id: 'globalEndIndex',
    },
  )
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
        options.domain[0],
        options.domain[options.domain.length - 1],
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
        options.domain[0],
        options.domain[options.domain.length - 1],
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
  const enabledStateByGraphKey = observable(
    options.graphs.reduce(
      (state, graph) => ({
        ...state,
        [graph.key]: options.visibility[graph.key],
      }),
      {} as EnabledGraphKeys,
    ),
    { id: 'enabledStateByGraphKey' },
  )

  const enabledStateByMarkerIndex = observable(
    options.markers.reduce(
      (previousValue, _, index) => ({
        ...previousValue,
        [index]: true,
      }),
      {} as Record<number, boolean>,
    ),
    { id: 'enabledStateByMarkerIndex' },
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
    [enabledStateByGraphKey],
    function computeEnabledGraphKeys(enabledStateByGraphKey) {
      return options.graphs
        .filter(graph => enabledStateByGraphKey[graph.key])
        .map(graph => graph.key)
    },
  )

  const isAnyGraphEnabled = computeLazy(
    [enabledGraphKeys],
    enabledGraphKeys => {
      return enabledGraphKeys.length !== 0
    },
  )

  const {
    minMaxByGraphKey: visibleMinMaxByGraphKey,
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

  const inertVisibleMinMaxByGraphKey = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: visibleMinMaxByGraphKey,
  })

  const {
    max: globalMax,
    min: globalMin,
    minMaxByGraphKey: globalMinMaxByGraphKey,
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

  const inertGlobalMinMaxByGraphKey = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: globalMinMaxByGraphKey,
  })

  const opacityStateByGraphKey = compute(
    [enabledStateByGraphKey],
    enabledStateByGraphKey => {
      return options.graphs.reduce(
        (state, graph) => ({
          ...state,
          [graph.key]: Number(enabledStateByGraphKey[graph.key]),
        }),
        {} as OpacityState,
      )
    },
  )

  const inertOpacityStateByGraphKey = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: opacityStateByGraphKey,
  })

  const opacityStateByMarkerIndex = compute(
    [enabledStateByMarkerIndex],
    enabledStateByMarkerIndex => {
      return options.markers.reduce(
        (previousValue, currentValue, index) => ({
          ...previousValue,
          [index]: Number(enabledStateByMarkerIndex[index]),
        }),
        {} as Record<number, number>,
      )
    },
  )

  const inertOpacityStateByMarkerIndex = inert({
    duration: TRANSITION.SLOW,
    easing: special,
    target: opacityStateByMarkerIndex,
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
        {} as { [key: string]: Points },
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
        inertVisibleMinMaxByGraphKey.setTransition(TRANSITION.MEDIUM)
      } else {
        inertVisibleMax.setTransition({
          duration: TRANSITION.SLOW,
          easing: special,
        })
        inertVisibleMin.setTransition({
          duration: TRANSITION.SLOW,
          easing: special,
        })
        inertVisibleMinMaxByGraphKey.setTransition({
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
    enabledStateByGraphKey,
    enabledStateByMarkerIndex,
    enabledGraphKeys,
    isAnyGraphEnabled,
    mainGraphPoints,
    startIndex,
    endIndex,
    mouseX,
    inertOpacityStateByGraphKey,
    inertOpacityStateByMarkerIndex,
    visibleMax,
    visibleMin,
    width,
    canvasHeight,
    height,
    globalMax,
    globalMin,
    inertGlobalMax,
    inertGlobalMin,
    globalMinMaxByGraphKey,
    visibleMinMaxByGraphKey,
    inertVisibleMinMaxByGraphKey,
    inertGlobalMinMaxByGraphKey,
    globalStartIndex,
    globalEndIndex,
    inertVisibleMax,
    inertVisibleMin,
    inertStartX,
    inertEndX,
    globalStartX,
    globalEndX,
  }
}
