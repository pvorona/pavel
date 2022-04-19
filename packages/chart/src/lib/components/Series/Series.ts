import { effect } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../renderers'
import { ChartContext, ChartOptions } from '../../types'
import { toBitMapSize } from '../../util'
import { cursor, MIN_HEIGHT } from '../constants'
import { Component, Point } from '../types'
import { createGraphs } from '../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'
import { addEventListeners, handleDrag, interpolate } from '@pavel/utils'

export const Series: Component<ChartOptions, ChartContext> = (
  options,
  {
    width,
    mainGraphPoints,
    inertOpacityStateByGraphName,
    isHovering,
    isGrabbingGraphs,
    activeCursor,
    mouseX,
    canvasHeight,
    inertVisibleMin,
    inertVisibleMax,
    inertVisibleMinMaxByGraphName,
    endX,
    startX,
  },
) => {
  const { element, canvas, context } = createDOM()

  scheduleTask(() => {
    renderPoints(
      mainGraphPoints.value,
      inertOpacityStateByGraphName.value,
      inertVisibleMin.value,
      inertVisibleMax.value,
      inertVisibleMinMaxByGraphName.value,
    )
  })

  effect(
    [width, canvasHeight],
    (width, height) => {
      setCanvasSize(canvas, toBitMapSize(width), toBitMapSize(height))
      renderPoints(
        mainGraphPoints.value,
        inertOpacityStateByGraphName.value,
        inertVisibleMin.value,
        inertVisibleMax.value,
        inertVisibleMinMaxByGraphName.value,
      )
    },
    { fireImmediately: false },
  )

  effect(
    [
      mainGraphPoints,
      inertOpacityStateByGraphName,
      inertVisibleMin,
      inertVisibleMax,
      inertVisibleMinMaxByGraphName,
    ],
    (
      mainGraphPoints,
      inertOpacityStateByGraphName,
      inertVisibleMin,
      inertVisibleMax,
      inertVisibleMinMaxByGraphName,
    ) => {
      clearRect(
        context,
        toBitMapSize(width.value),
        toBitMapSize(canvasHeight.value),
      )
      renderPoints(
        mainGraphPoints,
        inertOpacityStateByGraphName,
        inertVisibleMin,
        inertVisibleMax,
        inertVisibleMinMaxByGraphName,
      )
    },
    { fireImmediately: false },
  )

  function renderPoints(
    points: { [key: string]: Point[] },
    opacityState: { [key: string]: number },
    min: number,
    max: number,
    minMaxByGraphName: Record<string, { min: number; max: number }>,
  ) {
    renderLineSeriesWithAreaGradient({
      points,
      opacityState,
      context: context,
      graphNames: options.graphNames,
      lineWidth: options.lineWidth,
      strokeStyles: options.colors,
      height: canvasHeight.value,
      width: width.value,
      lineJoinByName: options.lineJoin,
      lineCapByName: options.lineCap,
      min,
      max,
      minMaxByGraphName,
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
      height: canvasHeight.value,
      containerHeight: canvasHeight.value,
      containerMinHeight: MIN_HEIGHT,
    })
  }

  function initDragListeners() {
    addEventListeners(element, {
      mouseenter(e) {
        isHovering.value = true
        mouseX.value = e.clientX
      },
      mouseleave() {
        isHovering.value = false
      },
      mousemove(e) {
        mouseX.value = e.clientX
      },
    })

    let prevMouseX = 0

    const handleGraphsDragMove = (e: MouseEvent | Touch) => {
      const visibleRange = endX.value - startX.value
      const newX = interpolate(
        0,
        width.value,
        startX.value,
        endX.value,
        prevMouseX - e.clientX,
      )

      startX.value = newX
      endX.value = newX + visibleRange

      prevMouseX = e.clientX
    }

    handleDrag(element, {
      onDragStart: event => {
        isGrabbingGraphs.value = true
        activeCursor.value = cursor.grabbing

        prevMouseX = event.clientX
      },
      onDragEnd: () => {
        isGrabbingGraphs.value = false
        activeCursor.value = cursor.default

        prevMouseX = 0
      },
      onDragMove: handleGraphsDragMove,
    })
  }
}
