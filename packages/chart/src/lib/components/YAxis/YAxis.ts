import { assert, isNull } from '@pavel/assert'
import { computeLazy, effect } from '@pavel/observable'
import { scheduleTask } from '@pavel/scheduling'
import { getNumberOfDecimalDigits, interpolate, isInteger } from '@pavel/utils'
import { BitMapSize, ChartContext, InternalChartOptions } from '../../types'
import { getClosestGreaterOrEqualDivisibleInt, toBitMapSize } from '../../util'
import { clearRect, line, setCanvasSize } from '../renderers'

export const YAxis = (
  options: InternalChartOptions,
  {
    width,
    canvasHeight: height,
    inertVisibleMin,
    inertVisibleMax,
  }: ChartContext,
) => {
  const { element, context, fragment } = createDOM(
    width.get(),
    height.get(),
    options.y.color,
  )

  const unit = computeLazy(
    [inertVisibleMin, inertVisibleMax],
    (inertVisibleMin, inertVisibleMax) => {
      const yRange = inertVisibleMax - inertVisibleMin

      return computeScaleUnit(yRange, options.y.ticks)
    },
  )

  scheduleTask(() => {
    renderLabelsAndGrid(
      inertVisibleMin.get(),
      inertVisibleMax.get(),
      unit.get(),
      width.get(),
      height.get(),
    )
  })

  effect(
    [width, height],
    (width, height) => {
      element.style.height = `${height}px`
      element.style.width = `${width}px`

      setCanvasSize(element, toBitMapSize(width), toBitMapSize(height))
      setCanvasStyle(
        context,
        options.y.label.color,
        options.y.color,
        options.y.label.fontSize,
        options.y.label.fontFamily,
      )
      renderLabelsAndGrid(
        inertVisibleMin.get(),
        inertVisibleMax.get(),
        unit.get(),
        width,
        height,
      )
    },
    { fireImmediately: false },
  )

  effect(
    [inertVisibleMin, inertVisibleMax, unit],
    (inertVisibleMin, inertVisibleMax, factor) => {
      clearRect(
        context,
        0,
        0,
        toBitMapSize(width.get()),
        toBitMapSize(height.get()),
      )
      renderLabelsAndGrid(
        inertVisibleMin,
        inertVisibleMax,
        factor,
        width.get(),
        height.get(),
      )
    },
    { fireImmediately: false },
  )

  return { element: fragment }

  function renderLabelsAndGrid(
    inertVisibleMin: number,
    inertVisibleMax: number,
    unit: number,
    width: number,
    height: number,
  ) {
    context.beginPath()

    const precision = getNumberOfDecimalDigits(unit)

    for (
      let i = getClosestGreaterOrEqualDivisibleInt(inertVisibleMin, unit);
      i <= inertVisibleMax;
      i += unit
    ) {
      const screenY = toBitMapSize(
        interpolate(inertVisibleMin, inertVisibleMax, height, 0, i),
      )
      const x1 = 0 as BitMapSize
      const y1 = screenY
      const x2 = toBitMapSize(width)
      const y2 = screenY
      const textY = screenY - toBitMapSize(options.y.label.margin.blockEnd)
      const label = i.toFixed(precision)

      if (textY - toBitMapSize(options.y.label.fontSize) < 0) continue

      context.fillText(
        label,
        toBitMapSize(options.y.label.margin.inlineStart),
        textY,
      )
      line(context, x1, y1, x2, y2)
    }

    context.stroke()
  }

  function createDOM(width: number, height: number, color: string) {
    const fragment = document.createDocumentFragment()

    const overlay = document.createElement('div')
    overlay.style.backgroundImage =
      'linear-gradient(90deg, rgba(33, 44, 48, 0.75) 45px, rgb(33 44 48 / 20%) 245px, rgba(33 44 48 / 0%) 445px)'
    overlay.style.top = `0`
    overlay.style.height = `${height + 80}px`
    overlay.style.position = 'absolute'
    overlay.style.width = `100%`
    overlay.style.pointerEvents = 'none'

    fragment.appendChild(overlay)

    const element = document.createElement('canvas')
    const context = element.getContext('2d')

    assert(!isNull(context), 'Cannot acquire context')

    element.style.height = `${height}px`
    element.style.position = 'absolute'
    element.style.width = `100%`
    element.style.pointerEvents = 'none'
    setCanvasSize(element, toBitMapSize(width), toBitMapSize(height))
    setCanvasStyle(
      context,
      options.y.label.color,
      options.y.color,
      options.y.label.fontSize,
      options.y.label.fontFamily,
    )

    context.strokeStyle = color
    fragment.appendChild(element)

    return { fragment, element, context }
  }

  function setCanvasStyle(
    context: CanvasRenderingContext2D,
    fillColor: string,
    strokeColor: string,
    fontSize: number,
    fontFamily: string,
  ) {
    context.fillStyle = fillColor
    context.font = `${toBitMapSize(fontSize)}px ${fontFamily}`
    context.textBaseline = 'bottom'
    context.textAlign = 'left'
    context.strokeStyle = strokeColor
  }
}

const PREFERRED_FACTORS = [1, 2, 5]
const MAX_ITERATIONS = 100

function computeScaleUnit(number: number, ticks: number) {
  let factorMultiplier = 1e-6
  let factorIndex = 0
  let iterationIndex = MAX_ITERATIONS

  while (iterationIndex--) {
    const currentUnit = factorMultiplier * PREFERRED_FACTORS[factorIndex]

    if (number / currentUnit < ticks) {
      return currentUnit
    }

    factorIndex = (factorIndex + 1) % PREFERRED_FACTORS.length

    if (factorIndex === 0) {
      factorMultiplier *= 10
    }
  }

  return 1
}
