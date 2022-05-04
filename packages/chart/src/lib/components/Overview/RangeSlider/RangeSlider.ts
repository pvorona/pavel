import { effect, observable, observe } from '@pavel/observable'
import { ensureInBounds, handleDrag } from '@pavel/utils'
import { ChartContext, ChartOptions } from '../../../types'
import { areNumbersClose } from '../../../util'
import {
  cursor,
  DEVIATION_FROM_STRAIGHT_LINE_DEGREES,
  MIN_VIEWBOX,
  WHEEL_MULTIPLIER,
} from '../../constants'
import { Component } from '../../types'

import './overview-resize-handler.css'
import './overview-viewbox.css'

const minimalPixelsBetweenResizeHandlers = 10

export const RangeSlider: Component<ChartOptions, ChartContext> = (
  options,
  context,
) => {
  const {
    startIndex,
    endIndex,
    width,
    isDragging,
    activeCursor,
    isWheeling,
    inertStartIndex,
    inertEndIndex,
    inertVisibleMax,
    inertVisibleMin,
    inertGlobalMinMaxByGraphName,
    inertVisibleMinMaxByGraphName,
  } = context

  const {
    viewBoxElement,
    leftResizeHandler,
    rightResizeHandler,
    leftSide,
    rightSide,
  } = createDOM()

  // Compute with set
  const left = observable(
    // interpolate
    (startIndex.value / (options.total - 1)) * width.value,
  )

  const right = observable(
    // interpolate
    (endIndex.value / (options.total - 1)) * width.value,
  )

  effect([left], left => {
    viewBoxElement.style.left = `${left}px`
  })

  effect([right, width], (right, width) => {
    viewBoxElement.style.right = `${width - right}px`
  })

  observe([startIndex, width], (startIndex, width) => {
    // interpolate
    const newLeft = (startIndex / (options.total - 1)) * width

    if (!areNumbersClose(left.value, newLeft)) {
      left.value = newLeft
    }
  })

  observe([endIndex, width], (endIndex, width) => {
    // interpolate
    const newRight = (endIndex / (options.total - 1)) * width

    if (!areNumbersClose(right.value, newRight)) {
      right.value = newRight
    }
  })

  observe([left], left => {
    // interpolate
    const newStartIndex = (left / width.value) * (options.total - 1)

    if (!areNumbersClose(startIndex.value, newStartIndex)) {
      startIndex.value = newStartIndex
    }
  })

  observe([right], right => {
    // interpolate
    const newEndIndex = Math.min(
      (right / width.value) * (options.total - 1),
      options.total - 1,
    )

    if (!areNumbersClose(endIndex.value, newEndIndex)) {
      endIndex.value = newEndIndex
    }
  })

  let cursorResizeHandlerDelta = 0

  leftSide.addEventListener('mousedown', onLeftSideClick)
  rightSide.addEventListener('mousedown', onRightSideClick)

  function onLeftSideClick(event: MouseEvent) {
    const viewBoxWidth = right.value - left.value
    const newLeft = ensureInBounds(
      event.clientX - viewBoxWidth / 2,
      0,
      width.value,
    )
    const newRight = newLeft + viewBoxWidth

    left.value = newLeft
    right.value = newRight
    inertStartIndex.complete()
    inertEndIndex.complete()
    inertVisibleMax.complete()
    inertVisibleMin.complete()
    inertGlobalMinMaxByGraphName.complete()
    inertVisibleMinMaxByGraphName.complete()
  }

  function onRightSideClick(event: MouseEvent) {
    const viewBoxWidth = right.value - left.value
    const newRight = ensureInBounds(
      event.clientX + viewBoxWidth / 2,
      0,
      width.value,
    )
    const newLeft = newRight - viewBoxWidth

    left.value = newLeft
    right.value = newRight
    inertStartIndex.complete()
    inertEndIndex.complete()
    inertVisibleMax.complete()
    inertVisibleMin.complete()
    inertGlobalMinMaxByGraphName.complete()
    inertVisibleMinMaxByGraphName.complete()
  }

  handleDrag(leftResizeHandler, {
    onDragStart: onLeftResizeHandlerMouseDown,
    onDragMove: onLeftResizeHandlerMouseMove,
    onDragEnd: onDragEnd,
  })
  handleDrag(rightResizeHandler, {
    onDragStart: onRightResizeHandlerMouseDown,
    onDragMove: onRightResizeHandlerMouseMove,
    onDragEnd: onDragEnd,
  })
  handleDrag(viewBoxElement, {
    onDragStart: onViewBoxElementMouseDown,
    onDragMove: onViewBoxElementMouseMove,
    onDragEnd: onViewBoxElementMouseUp,
  })

  viewBoxElement.addEventListener('wheel', onWheel)

  function onLeftResizeHandlerMouseDown(event: MouseEvent) {
    isDragging.value = true
    activeCursor.value = cursor.resize
    cursorResizeHandlerDelta = event.clientX - left.value
  }

  function onDragEnd() {
    isDragging.value = false
    activeCursor.value = cursor.default
  }

  function onLeftResizeHandlerMouseMove(event: MouseEvent) {
    const leftVar = ensureInOverviewBounds(
      event.clientX - cursorResizeHandlerDelta,
    )

    left.value = ensureInBounds(
      leftVar,
      0,
      right.value - minimalPixelsBetweenResizeHandlers,
    )
  }

  function onRightResizeHandlerMouseDown(event: MouseEvent) {
    cursorResizeHandlerDelta = event.clientX - right.value
    isDragging.value = true
    activeCursor.value = cursor.resize
  }

  function ensureInOverviewBounds(x: number) {
    return ensureInBounds(x, 0, width.value)
  }

  function onViewBoxElementMouseDown(event: MouseEvent) {
    cursorResizeHandlerDelta = event.clientX - left.value
    isDragging.value = true
    activeCursor.value = cursor.grabbing
  }

  function onViewBoxElementMouseUp() {
    isDragging.value = false
    activeCursor.value = cursor.default
  }

  function onViewBoxElementMouseMove(event: MouseEvent) {
    const widthVar = right.value - left.value
    const nextLeft = event.clientX - cursorResizeHandlerDelta
    const stateLeft = ensureInBounds(nextLeft, 0, width.value - widthVar)
    left.value = stateLeft
    right.value = stateLeft + widthVar
  }

  function onRightResizeHandlerMouseMove(event: MouseEvent) {
    const rightVar = ensureInOverviewBounds(
      event.clientX - cursorResizeHandlerDelta,
    )
    right.value = ensureInBounds(
      rightVar,
      left.value + minimalPixelsBetweenResizeHandlers,
      rightVar,
    )
  }

  // Exact copy of Series#onWheel
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    isWheeling.value = true

    const angle = (Math.atan(e.deltaY / e.deltaX) * 180) / Math.PI

    const viewBoxWidth = endIndex.value - startIndex.value
    const dynamicFactor = (viewBoxWidth / MIN_VIEWBOX) * WHEEL_MULTIPLIER

    if (
      (angle < -(90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES) && angle >= -90) || // top right, bottom left
      (angle > 90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES && angle <= 90) // top left, bottom right
    ) {
      const deltaY = e.deltaY

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
        startIndex.value + e.deltaX * dynamicFactor,
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

  return { element: viewBoxElement }

  function createDOM() {
    const leftResizeHandler = document.createElement('div')
    leftResizeHandler.style.backgroundColor = options.overview.edgeColor
    leftResizeHandler.className =
      'overview__resize-handler overview__resize-handler--left'
    const rightResizeHandler = document.createElement('div')
    rightResizeHandler.style.backgroundColor = options.overview.edgeColor
    rightResizeHandler.className =
      'overview__resize-handler overview__resize-handler--right'
    const viewBoxElement = document.createElement('div')
    viewBoxElement.style.borderColor = options.overview.edgeColor
    viewBoxElement.className = 'overview__viewbox'

    const leftSide = document.createElement('div')
    leftSide.style.backgroundColor = options.overview.overlayColor
    leftSide.className = 'overview__left'
    const rightSide = document.createElement('div')
    rightSide.style.backgroundColor = options.overview.overlayColor
    rightSide.className = 'overview__right'

    viewBoxElement.appendChild(leftSide)
    viewBoxElement.appendChild(rightSide)
    viewBoxElement.appendChild(leftResizeHandler)
    viewBoxElement.appendChild(rightResizeHandler)

    return {
      viewBoxElement,
      leftResizeHandler,
      rightResizeHandler,
      leftSide,
      rightSide,
    }
  }
}
