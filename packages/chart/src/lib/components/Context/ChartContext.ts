import {
  effect,
  observable,
  computeLazy,
  observe,
  resetWhenInactive,
  inert,
  compute,
  interpolateMap,
  interpolateMinMax,
} from '@pavel/observable'
import { ChartOptions } from '../../types'
import {
  cursor,
  TRANSITION,
  MIN_HEIGHT,
  WHEEL_CLEAR_TIMEOUT,
} from '../constants'
import { OpacityState, Point, EnabledGraphNames } from '../types'
import { mapDataToCoords, createMinMaxView } from '../../util'
import { special } from '@pavel/easing'

export const ChartContext = (options: ChartOptions) => {
  const globalStartIndex = observable(0, {
    name: 'globalStartIndex',
  })
  const globalEndIndex = observable(options.total - 1, {
    name: 'globalEndIndex',
  })
  const width = observable(options.width, { name: 'width' })
  const height = observable(options.height, { name: 'height' })
  const canvasHeight = compute([height], computeCanvasHeight, {
    name: 'canvasHeight',
  })
  const startIndex = observable(options.viewBox.startIndex, {
    name: 'startIndex',
  })
  const endIndex = observable(options.viewBox.endIndex, { name: 'endIndex' })
  const mouseX = observable(0, { name: 'mouseX' })
  const isHovering = observable(false, { name: 'isHovering' })
  const isDragging = observable(false, { name: 'isDragging' })
  const isGrabbingGraphs = observable(false, { name: 'isGrabbingGraphs' })
  const isWheeling = resetWhenInactive(WHEEL_CLEAR_TIMEOUT)(
    observable(false, { name: 'isWheeling' }),
  )
  const activeCursor = observable(cursor.default, { name: 'activeCursor' })
  const enabledStateByGraphName = observable(
    options.graphNames.reduce(
      (state, graphName) => ({
        ...state,
        [graphName]: options.visibility[graphName],
      }),
      {} as EnabledGraphNames,
    ),
    { name: 'enabledStateByGraphName' },
  )

  function computeCanvasHeight(containerHeight: number) {
    return Math.max(
      containerHeight -
        options.overview.height -
        options.x.tick.height -
        options.x.tick.margin -
        options.x.label.fontSize -
        options.x.marginBottom -
        options.x.marginTop,
      MIN_HEIGHT,
    )
  }

  const enabledGraphNames = computeLazy(
    [enabledStateByGraphName],
    function enabledGraphNamesCompute(enabledStateByGraphName) {
      return options.graphNames.filter(
        graphName => enabledStateByGraphName[graphName],
      )
    },
  )

  const isAnyGraphEnabled = computeLazy(
    [enabledGraphNames],
    enabledGraphNames => {
      return enabledGraphNames.length !== 0
    },
  )

  const inertStartIndex = inert(TRANSITION.FAST)(startIndex)

  const inertEndIndex = inert(TRANSITION.FAST)(endIndex)

  const {
    minMaxByGraphName: visibleMinMaxByGraphName,
    min: visibleMin,
    max: visibleMax,
  } = createMinMaxView(
    startIndex,
    endIndex,
    enabledGraphNames,
    options.graphNames,
    options.data,
  )

  const inertVisibleMax = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })(visibleMax)

  const inertVisibleMin = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })(visibleMin)

  const inertVisibleMinMaxByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })({
    target: visibleMinMaxByGraphName,
    interpolate: interpolateMinMax,
  })

  const {
    max: globalMax,
    min: globalMin,
    minMaxByGraphName: globalMinMaxByGraphName,
  } = createMinMaxView(
    globalStartIndex,
    globalEndIndex,
    enabledGraphNames,
    options.graphNames,
    options.data,
  )

  const inertGlobalMax = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })(globalMax)

  const inertGlobalMin = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })(globalMin)

  const inertGlobalMinMaxByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })({
    target: globalMinMaxByGraphName,
    interpolate: interpolateMinMax,
  })

  // why lazy
  const opacityStateByGraphName = computeLazy(
    [enabledStateByGraphName],
    function opacityStateByGraphNameCompute(enabledStateByGraphName) {
      return options.graphNames.reduce(
        (state, graphName) => ({
          ...state,
          [graphName]: Number(enabledStateByGraphName[graphName]),
        }),
        {} as OpacityState,
      )
    },
  )

  const inertOpacityStateByGraphName = inert({
    duration: TRANSITION.SLOW,
    easing: special,
  })({
    target: opacityStateByGraphName,
    interpolate: interpolateMap,
  })

  const mainGraphPoints = computeLazy(
    [
      inertStartIndex,
      inertEndIndex,
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
      return options.graphNames.reduce(
        (points, graphName) => ({
          ...points,
          [graphName]: mapDataToCoords(
            options.data[graphName],
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
    for (const key in cursor) {
      const className = cursor[key]

      if (className) {
        document.body.classList.remove(className)
      }
    }

    if (activeCursor) {
      document.body.classList.add(activeCursor)
    }
  })

  return {
    isHovering,
    isDragging,
    isWheeling,
    isGrabbingGraphs,
    activeCursor,
    enabledStateByGraphName,
    enabledGraphNames,
    isAnyGraphEnabled,
    mainGraphPoints,
    startIndex,
    endIndex,
    inertStartIndex,
    inertEndIndex,
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
  }
}
