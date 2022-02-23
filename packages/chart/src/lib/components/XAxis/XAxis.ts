import { makeCached } from '@pavel/data-structures'
import { computeLazy, effect } from '@pavel/observable'
import { scheduleTask } from '@pavel/scheduling'
import { ChartContext, ChartOptions } from '../../types'
import {
  toScreenX,
  toBitMapSize,
  getClosestGreaterOrEqualDivisibleInt,
} from '../../util'
import { clearRect, setCanvasSize } from '../renderers'
import { Component } from '../types'

// - Rsi realStartIndex
// - Si startIndex
// - Ei endIndex
// - Rei realEndIndex

//         Data
//      0 ....... N
// 10   10.3      17.6   18
// Rsi  Si        Ei     Rei

// - [x] Config
// - [x] Changing window size does not changes canvas size
// - [x] Re-rendering when view box does not change (toggle graphs) | State machine?
// - [x] Dates cache
// - [x] Ticks
// - [x] First and last labels can be clipped
// - [x] Starting not from 0
// - [x] Render is executed multiple times initially
// - [ ] Ticks should overlap main canvas
// - [ ] Highlight tick when hovering point around it
// - [ ] Calculating factor with loop
// - [ ] Extract domain to screen coords mapping from graph points to reuse?
// - [ ] Animation when changing step size
//       Inert Observable Factor
//       opacity -> progress between int factors
//       animating multiple factor groups?

const CACHE_TICKS_MULTIPLIER = 100

export const XAxis: Component<ChartOptions, ChartContext> = (
  options,
  { inertStartIndex, inertEndIndex, width },
) => {
  const labels = makeCached(formatTimestamp, {
    max: options.x.ticks * CACHE_TICKS_MULTIPLIER,
  })
  const {
    x: {
      color,
      marginBottom,
      marginTop,
      tick: { height: tickHeight, margin: tickMargin },
      label: { fontSize, fontFamily },
    },
  } = options
  const height = fontSize + tickHeight + tickMargin
  const factor = computeLazy(
    [inertStartIndex, inertEndIndex],
    (inertStartIndex, inertEndIndex) =>
      computeScaleFactor(inertEndIndex - inertStartIndex, options.x.ticks),
  )
  const { element, context, canvas } = createDOM({
    height,
    marginBottom,
    marginTop,
  })

  scheduleTask(() => {
    renderLabels(inertStartIndex.value, inertEndIndex.value, factor.value)
  })

  effect(
    [width],
    width => {
      setCanvasSize(canvas, toBitMapSize(width), toBitMapSize(height))
      setCanvasStyle(context)
      renderLabels(inertStartIndex.value, inertEndIndex.value, factor.value)
    },
    { fireImmediately: false },
  )

  effect(
    [inertStartIndex, inertEndIndex, factor],
    (inertStartIndex, inertEndIndex, factor) => {
      clearRect(context, toBitMapSize(width.value), toBitMapSize(height))
      renderLabels(inertStartIndex, inertEndIndex, factor)
    },
    { fireImmediately: false },
  )

  return { element }

  function renderLabels(
    inertStartIndex: number,
    inertEndIndex: number,
    factor: number,
  ) {
    for (
      let i = getClosestGreaterOrEqualDivisibleInt(
        Math.floor(inertStartIndex),
        factor,
      );
      i <= Math.floor(inertEndIndex);
      i += factor
    ) {
      const screenX = toBitMapSize(
        toScreenX(
          options.domain,
          width.value,
          inertStartIndex,
          inertEndIndex,
          i,
        ),
      )
      const label = labels.get(options.domain[i])
      const { width: labelWidth } = context.measureText(label)

      if (screenX < labelWidth / 2) continue
      if (toBitMapSize(width.value) - screenX < labelWidth / 2) continue

      context.fillText(label, screenX, 0)
    }
  }

  function createDOM({
    height,
    marginBottom,
    marginTop,
  }: {
    height: number
    marginBottom: number
    marginTop: number
  }) {
    const canvas = document.createElement('canvas')
    canvas.style.marginBottom = `${marginBottom}px`
    canvas.style.marginTop = `${marginTop}px`
    canvas.style.width = `100%`
    canvas.style.height = `${height}px`
    const context = canvas.getContext('2d')

    if (context === null) {
      throw new Error('Failed to acquire context')
    }

    setCanvasSize(canvas, toBitMapSize(width.value), toBitMapSize(height))
    setCanvasStyle(context)

    return { element: canvas, canvas, context }
  }

  function setCanvasStyle(context: CanvasRenderingContext2D) {
    context.fillStyle = color
    context.font = `${toBitMapSize(fontSize)}px ${fontFamily}`
    context.textBaseline = 'top'
    context.textAlign = 'center'
    context.strokeStyle = color
  }
}

function computeScaleFactor(number: number, ticks: number) {
  let factor = 1

  while (number / factor > ticks) {
    factor *= 2
  }

  return factor
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}
