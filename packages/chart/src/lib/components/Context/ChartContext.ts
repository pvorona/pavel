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
  Transition,
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
  const canvasHeight = observable(computeCanvasHeight(height.get()), {
    name: 'canvasHeight',
  })
  const startIndex = observable(options.viewBox.startIndex, {
    name: 'startIndex',
  })

  ;(window as any).startIndex = startIndex
  
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

  const inertStartIndex = inert(Transition.Fast)(startIndex)

  const inertEndIndex = inert(Transition.Fast)(endIndex)

  const {
    minMaxByGraphName: visibleMinMaxByGraphName,
    min: visibleMin,
    max: visibleMax,
  } = createMinMaxView(startIndex, endIndex, enabledGraphNames, options.data)

  const inertVisibleMax = inert({
    duration: Transition.Slow,
    easing: special,
  })(visibleMax)

  const inertVisibleMin = inert({
    duration: Transition.Slow,
    easing: special,
  })(visibleMin)

  const { max: globalMax, min: globalMin } = createMinMaxView(
    globalStartIndex,
    globalEndIndex,
    enabledGraphNames,
    options.data,
  )

  const inertGlobalMax = inert({
    duration: Transition.Slow,
    easing: special,
  })(globalMax)

  const inertGlobalMin = inert({
    duration: Transition.Slow,
    easing: special,
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
    duration: Transition.Slow,
    easing: special,
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
        inertVisibleMax.setTransition(Transition.Medium)
        inertVisibleMin.setTransition(Transition.Medium)
      } else {
        inertVisibleMax.setTransition({
          duration: Transition.Slow,
          easing: special,
        })
        inertVisibleMin.setTransition({
          duration: Transition.Slow,
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
