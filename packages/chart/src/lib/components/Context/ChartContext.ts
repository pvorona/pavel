import {
  effect,
  observable,
  computeLazy,
  observe,
  resetWhenInactive,
  inert,
} from '@pavel/observable'
import { ChartOptions } from '../../types'
import {
  cursor,
  MEDIUM,
  SLOW,
  MIN_HEIGHT,
  FAST,
  WHEEL_CLEAR_TIMEOUT,
} from '../constants'
import { OpacityState, Point, EnabledGraphNames } from '../types'
import { mapDataToCoords, createMinMaxView } from '../../util'
import { easeInOutQuart } from '@pavel/easing'

export const ChartContext = (options: ChartOptions) => {
  const globalStartIndex = observable(0)
  const globalEndIndex = observable(options.total - 1)
  const width = observable(options.width)
  const height = observable(options.height)
  const canvasHeight = observable(computeCanvasHeight(height.get()))
  const startIndex = observable(options.viewBox.startIndex)
  const endIndex = observable(options.viewBox.endIndex)
  const mouseX = observable(0)
  const isHovering = observable(false)
  const isDragging = observable(false)
  const isGrabbingGraphs = observable(false)
  const isWheeling = resetWhenInactive({ delay: WHEEL_CLEAR_TIMEOUT })(
    observable(false),
  )
  const activeCursor = observable(cursor.default)
  const enabledStateByGraphName = observable(
    options.graphNames.reduce(
      (state, graphName) => ({
        ...state,
        [graphName]: options.visibility[graphName],
      }),
      {} as EnabledGraphNames,
    ),
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

  observe([height], height => {
    canvasHeight.set(computeCanvasHeight(height))
  })

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

  // Transition.FAST
  // Duration.FAST
  const inertStartIndex = inert({ duration: FAST })(startIndex)

  const inertEndIndex = inert({ duration: FAST })(endIndex)

  const {
    minMaxByGraphName: visibleMinMaxByGraphName,
    min: visibleMin,
    max: visibleMax,
  } = createMinMaxView(startIndex, endIndex, enabledGraphNames, options.data)

  const inertVisibleMax = inert({
    duration: SLOW,
    easing: easeInOutQuart,
  })(visibleMax)

  const inertVisibleMin = inert({
    duration: SLOW,
    easing: easeInOutQuart,
  })(visibleMin)

  const { max: globalMax, min: globalMin } = createMinMaxView(
    globalStartIndex,
    globalEndIndex,
    enabledGraphNames,
    options.data,
  )

  const inertGlobalMax = inert({
    duration: SLOW,
    easing: easeInOutQuart,
  })(globalMax)

  const inertGlobalMin = inert({
    duration: SLOW,
    easing: easeInOutQuart,
  })(globalMin)

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
    duration: SLOW,
    easing: easeInOutQuart,
  })(opacityStateByGraphName)

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
        inertVisibleMax.setTransition({ duration: MEDIUM })
        inertVisibleMin.setTransition({ duration: MEDIUM })
      } else {
        inertVisibleMax.setTransition({
          duration: SLOW,
          easing: easeInOutQuart,
        })
        inertVisibleMin.setTransition({
          duration: SLOW,
          easing: easeInOutQuart,
        })
      }
    },
  )

  effect([activeCursor], activeCursor => {
    for (const key in cursor) {
      const className = cursor[key as keyof typeof cursor]

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
    visibleMinMaxByGraphName,
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
    globalStartIndex,
    globalEndIndex,
    inertVisibleMax,
    inertVisibleMin,
  }
}
