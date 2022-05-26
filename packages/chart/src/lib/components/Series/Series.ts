import { effect } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../renderers'
import { ChartContext, InternalChartOptions } from '../../types'
import { toBitMapSize } from '../../util'
import { cursor, MIN_HEIGHT } from '../constants'
import { Component, Point } from '../types'
import { createGraphs } from '../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'
import {
  addEventListeners,
  ensureInBounds,
  handleDrag,
  interpolate,
} from '@pavel/utils'

export const Series: Component<InternalChartOptions, ChartContext> = (
  options,
  chartContext,
) => {
  const {
    width,
    mainGraphPoints,
    inertOpacityStateByGraphKey,
    isHovering,
    isGrabbingGraphs,
    activeCursor,
    mouseX,
    canvasHeight,
    inertVisibleMin,
    inertVisibleMax,
    inertVisibleMinMaxByGraphKey,
    endX,
    startX,
  } = chartContext
  const { element, canvas, context } = createDOM()

  scheduleTask(() => {
    renderPoints(
      mainGraphPoints.get(),
      inertOpacityStateByGraphKey.get(),
      inertVisibleMin.get(),
      inertVisibleMax.get(),
      inertVisibleMinMaxByGraphKey.get(),
    )
  })

  effect(
    [width, canvasHeight],
    (width, height) => {
      setCanvasSize(canvas, toBitMapSize(width), toBitMapSize(height))
      renderPoints(
        mainGraphPoints.get(),
        inertOpacityStateByGraphKey.get(),
        inertVisibleMin.get(),
        inertVisibleMax.get(),
        inertVisibleMinMaxByGraphKey.get(),
      )
    },
    { fireImmediately: false },
  )

  effect(
    [
      mainGraphPoints,
      inertOpacityStateByGraphKey,
      inertVisibleMin,
      inertVisibleMax,
      inertVisibleMinMaxByGraphKey,
    ],
    (
      mainGraphPoints,
      inertOpacityStateByGraphKey,
      inertVisibleMin,
      inertVisibleMax,
      inertVisibleMinMaxByGraphKey,
    ) => {
      clearRect(
        context,
        0,
        0,
        toBitMapSize(width.get()),
        toBitMapSize(canvasHeight.get()),
      )
      renderPoints(
        mainGraphPoints,
        inertOpacityStateByGraphKey,
        inertVisibleMin,
        inertVisibleMax,
        inertVisibleMinMaxByGraphKey,
      )
    },
    { fireImmediately: false },
  )

  function renderPoints(
    points: { [key: string]: Point[] },
    opacityState: { [key: string]: number },
    min: number,
    max: number,
    minMaxByGraphKey: Record<string, { min: number; max: number }>,
  ) {
    renderLineSeriesWithAreaGradient({
      points,
      opacityState,
      context: context,
      graphs: options.graphs,
      lineWidth: options.lineWidth,
      colors: options.colors,
      height: canvasHeight.get(),
      width: width.get(),
      lineJoin: options.lineJoin,
      lineCap: options.lineCap,
      min,
      max,
      minMaxByGraphKey: minMaxByGraphKey,
      gradient: options.gradient,
    })
  }

  effect(
    [canvasHeight],
    height => {
      element.style.height = `${height}px`
    },
    { fireImmediately: false },
  )

  initDragListeners()

  return { element }

  function createDOM() {
    return createGraphs({
      width: options.width,
      height: canvasHeight.get(),
      containerHeight: canvasHeight.get(),
      containerMinHeight: MIN_HEIGHT,
    })
  }

  function initDragListeners() {
    addEventListeners(element, {
      mouseenter(e) {
        isHovering.set(true)
        mouseX.set(e.clientX)
      },
      mouseleave() {
        isHovering.set(false)
      },
      mousemove(e) {
        mouseX.set(e.clientX)
      },
    })

    let prevMouseX = 0

    const handleDragMove = (event: MouseEvent | Touch) => {
      const visibleRange = endX.get() - startX.get()
      const newX = interpolate(
        0,
        width.get(),
        startX.get(),
        endX.get(),
        prevMouseX - event.clientX,
      )

      startX.set(
        ensureInBounds(
          newX,
          options.domain[0],
          options.domain[options.domain.length - 1] - visibleRange,
        ),
      )
      endX.set(
        ensureInBounds(
          startX.get() + visibleRange,
          options.domain[0],
          options.domain[options.domain.length - 1],
        ),
      )

      prevMouseX = event.clientX
    }

    handleDrag(element, {
      onDragStart: event => {
        isGrabbingGraphs.set(true)
        activeCursor.set(cursor.grabbing)

        prevMouseX = event.clientX
      },
      onDragEnd: () => {
        isGrabbingGraphs.set(false)
        activeCursor.set(cursor.default)

        prevMouseX = 0
      },
      onDragMove: handleDragMove,
    })
  }
}
