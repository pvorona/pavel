import { effect } from '@pavel/observable'
import {
  clearRect,
  renderLineSeriesWithAreaGradient,
  setCanvasSize,
} from '../renderers'
import { ChartContext, ChartOptions } from '../../types'
import { handleDrag, interpolate, toBitMapSize } from '../../util'
import {
  MIN_VIEWBOX,
  WHEEL_MULTIPLIER,
  DEVIATION_FROM_STRAIGHT_LINE_DEGREES,
  cursor,
  MIN_HEIGHT,
} from '../constants'
import { Component, Point } from '../types'
import { createGraphs } from '../Graphs/createGraphs'
import { scheduleTask } from '@pavel/scheduling'
import { addEventListeners, ensureInBounds } from '@pavel/utils'

export const Series: Component<ChartOptions, ChartContext> = (
  options,
  {
    width,
    mainGraphPoints,
    inertOpacityStateByGraphName,
    startIndex,
    endIndex,
    isHovering,
    isGrabbingGraphs,
    activeCursor,
    mouseX,
    isWheeling,
    canvasHeight,
    inertVisibleMin,
    inertVisibleMax,
    visibleMinMaxByGraphName,
  },
) => {
  const { element, canvas, context } = createDOM()

  scheduleTask(() => {
    renderPoints(
      mainGraphPoints.value,
      inertOpacityStateByGraphName.value,
      inertVisibleMin.value,
      inertVisibleMax.value,
      visibleMinMaxByGraphName.value,
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
        visibleMinMaxByGraphName.value,
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
      // should be inert
      visibleMinMaxByGraphName,
    ],
    (
      mainGraphPoints,
      inertOpacityStateByGraphName,
      inertVisibleMin,
      inertVisibleMax,
      visibleMinMaxByGraphName,
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
        visibleMinMaxByGraphName,
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
      wheel: onWheel,
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

    const onGraphsDrag = (e: MouseEvent) => {
      const visibleIndexRange = endIndex.value - startIndex.value
      const newStartIndex = interpolate(
        0,
        width.value,
        startIndex.value,
        endIndex.value,
        prevMouseX - e.clientX,
      )

      startIndex.value = ensureInBounds(
        newStartIndex,
        0,
        options.total - 1 - visibleIndexRange,
      )
      endIndex.value = ensureInBounds(
        startIndex.value + visibleIndexRange,
        0,
        options.total - 1,
      )

      prevMouseX = e.clientX
    }

    handleDrag(element, {
      onDragStart: (e: MouseEvent) => {
        isGrabbingGraphs.value = true
        activeCursor.value = cursor.grabbing

        prevMouseX = e.clientX
      },
      onDragEnd: () => {
        isGrabbingGraphs.value = false
        activeCursor.value = cursor.default

        prevMouseX = 0
      },
      onDragMove: onGraphsDrag,
    })
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault()
    isWheeling.value = true

    const angle = (Math.atan(event.deltaY / event.deltaX) * 180) / Math.PI

    const viewBoxWidth = endIndex.value - startIndex.value
    const dynamicFactor = (viewBoxWidth / MIN_VIEWBOX) * WHEEL_MULTIPLIER

    if (
      (angle < -(90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES) && angle >= -90) || // top right, bottom left
      (angle > 90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES && angle <= 90) // top left, bottom right
    ) {
      const deltaY = event.deltaY

      if (
        deltaY < 0 &&
        endIndex.value -
          startIndex.value -
          2 * Math.abs(deltaY * dynamicFactor) <
          MIN_VIEWBOX
      ) {
        const center = (endIndex.value + startIndex.value) / 2
        startIndex.value = ensureInBounds(
          center - MIN_VIEWBOX / 2,
          0,
          options.total - 1 - MIN_VIEWBOX,
        )
        endIndex.value = ensureInBounds(
          center + MIN_VIEWBOX / 2,
          MIN_VIEWBOX,
          options.total - 1,
        )
      } else {
        startIndex.value = ensureInBounds(
          startIndex.value - deltaY * dynamicFactor,
          0,
          options.total - 1 - MIN_VIEWBOX,
        )
        endIndex.value = ensureInBounds(
          endIndex.value + deltaY * dynamicFactor,
          startIndex.value + MIN_VIEWBOX,
          options.total - 1,
        )
      }
    } else if (
      angle >= -DEVIATION_FROM_STRAIGHT_LINE_DEGREES &&
      angle <= DEVIATION_FROM_STRAIGHT_LINE_DEGREES // left, right
    ) {
      startIndex.value = ensureInBounds(
        startIndex.value + event.deltaX * dynamicFactor,
        0,
        options.total - 1 - viewBoxWidth,
      )
      endIndex.value = ensureInBounds(
        startIndex.value + viewBoxWidth,
        MIN_VIEWBOX,
        options.total - 1,
      )
    }
  }
}
