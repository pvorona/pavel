import { effect, observable, observe } from '@pavel/observable'
import { ensureInBounds, handleDrag, interpolate } from '@pavel/utils'
import { ChartContext, ChartOptions } from '../../../types'
import { areNumbersClose } from '../../../util'
import { cursor } from '../../constants'
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
    inertVisibleMax,
    inertVisibleMin,
    inertGlobalMinMaxByGraphName,
    inertVisibleMinMaxByGraphName,
    startX,
    endX,
    inertStartX,
    inertEndX,
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
    (startIndex.get() / (options.total - 1)) * width.get(),
    {
      is: areNumbersClose,
    },
  )

  const right = observable(
    // interpolate
    (endIndex.get() / (options.total - 1)) * width.get(),
    {
      is: areNumbersClose,
    },
  )

  effect([left], left => {
    viewBoxElement.style.left = `${left}px`
  })

  effect([right, width], (right, width) => {
    viewBoxElement.style.right = `${width - right}px`
  })

  observe([startX, width], (startX, width) => {
    const newLeft = interpolate(
      options.domain[0],
      options.domain[options.domain.length - 1],
      0,
      width,
      startX,
    )

    left.set(newLeft)
  })

  observe([endX, width], (endX, width) => {
    const newRight = interpolate(
      options.domain[0],
      options.domain[options.domain.length - 1],
      0,
      width,
      endX,
    )

    right.set(newRight)
  })

  observe([left, width], (left, width) => {
    const newX = interpolate(
      0,
      width,
      options.domain[0],
      options.domain[options.total - 1],
      left,
    )
    const boundedNewX = ensureInBounds(
      newX,
      options.domain[0],
      options.domain[options.domain.length - 1],
    )

    startX.set(boundedNewX)
  })

  observe([right, width], (right, width) => {
    const newX = interpolate(
      0,
      width,
      options.domain[0],
      options.domain[options.total - 1],
      right,
    )
    const boundedNewX = ensureInBounds(
      newX,
      options.domain[0],
      options.domain[options.domain.length - 1],
    )

    endX.set(boundedNewX)
  })

  let cursorResizeHandlerDelta = 0

  leftSide.addEventListener('mousedown', onLeftSideClick)
  rightSide.addEventListener('mousedown', onRightSideClick)

  function onLeftSideClick(event: MouseEvent) {
    const viewBoxWidth = right.get() - left.get()
    const newLeft = ensureInBounds(
      event.clientX - viewBoxWidth / 2,
      0,
      width.get(),
    )
    const newRight = newLeft + viewBoxWidth

    left.set(newLeft)
    right.set(newRight)
    inertStartX.complete()
    inertEndX.complete()
    inertVisibleMax.complete()
    inertVisibleMin.complete()
    inertGlobalMinMaxByGraphName.complete()
    inertVisibleMinMaxByGraphName.complete()
  }

  function onRightSideClick(event: MouseEvent) {
    const viewBoxWidth = right.get() - left.get()
    const newRight = ensureInBounds(
      event.clientX + viewBoxWidth / 2,
      0,
      width.get(),
    )
    const newLeft = newRight - viewBoxWidth

    left.set(newLeft)
    right.set(newRight)
    inertStartX.complete()
    inertEndX.complete()
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

  function onLeftResizeHandlerMouseDown(event: MouseEvent | Touch) {
    isDragging.set(true)
    activeCursor.set(cursor.resize)
    cursorResizeHandlerDelta = event.clientX - left.get()
  }

  function onDragEnd() {
    isDragging.set(false)
    activeCursor.set(cursor.default)
  }

  function onLeftResizeHandlerMouseMove(event: MouseEvent | Touch) {
    const leftVar = ensureInOverviewBounds(
      event.clientX - cursorResizeHandlerDelta,
    )

    left.set(
      ensureInBounds(
        leftVar,
        0,
        right.get() - minimalPixelsBetweenResizeHandlers,
      ),
    )
  }

  function onRightResizeHandlerMouseDown(event: MouseEvent | Touch) {
    cursorResizeHandlerDelta = event.clientX - right.get()
    isDragging.set(true)
    activeCursor.set(cursor.resize)
  }

  function ensureInOverviewBounds(x: number) {
    return ensureInBounds(x, 0, width.get())
  }

  function onViewBoxElementMouseDown(event: MouseEvent | Touch) {
    cursorResizeHandlerDelta = event.clientX - left.get()
    isDragging.set(true)
    activeCursor.set(cursor.grabbing)
  }

  function onViewBoxElementMouseUp() {
    isDragging.set(false)
    activeCursor.set(cursor.default)
  }

  function onViewBoxElementMouseMove(event: MouseEvent | Touch) {
    const widthVar = right.get() - left.get()
    const nextLeft = event.clientX - cursorResizeHandlerDelta
    const stateLeft = ensureInBounds(nextLeft, 0, width.get() - widthVar)
    left.set(stateLeft)
    right.set(stateLeft + widthVar)
  }

  function onRightResizeHandlerMouseMove(event: MouseEvent | Touch) {
    const rightVar = ensureInOverviewBounds(
      event.clientX - cursorResizeHandlerDelta,
    )
    right.set(
      ensureInBounds(
        rightVar,
        left.get() + minimalPixelsBetweenResizeHandlers,
        rightVar,
      ),
    )
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
