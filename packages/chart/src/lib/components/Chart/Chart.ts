import { Controls } from '../Controls'
import { ExternalChartOptions } from '../../types'
import { Overview } from '../Overview'
import { XAxis } from '../XAxis'
import { YAxis } from '../YAxis'
import { Tooltip } from '../Tooltip'
import { Series } from '../Series'
import { ChartContext } from '../Context'
import { throttleTask, PRIORITY } from '@pavel/scheduling'
import { createConfig } from '../../config'
import {
  DEVIATION_FROM_STRAIGHT_LINE_DEGREES,
  MIN_VIEWBOX_MS,
  WHEEL_SPEED,
} from '../constants'
import { ensureInBounds, interpolate } from '@pavel/utils'
import { Markers } from '../Markers'

export const Chart = (
  parent: HTMLElement,
  uncheckedOptions: ExternalChartOptions,
) => {
  const options = createConfig(parent, uncheckedOptions)
  const context = ChartContext(options)
  const { width, height, endX, startX, isWheeling } = context
  const { element } = createDOM()

  parent.appendChild(element)

  const handleResize = throttleTask(function measureContainerSize() {
    width.set(parent.offsetWidth)
    height.set(parent.offsetHeight)
  }, PRIORITY.READ)

  window.addEventListener('resize', handleResize)
  element.addEventListener('wheel', handleWheel, { passive: false })

  return { element }

  function handleWheel(event: WheelEvent) {
    event.preventDefault()

    isWheeling.set(true)

    const angle = (Math.atan(event.deltaY / event.deltaX) * 180) / Math.PI
    const viewBoxWidth = endX.get() - startX.get()
    const dynamicFactor = viewBoxWidth * WHEEL_SPEED

    if (
      (angle < -(90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES) && angle >= -90) || // top right, bottom left
      (angle > 90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES && angle <= 90) // top left, bottom right
    ) {
      const deltaY = event.deltaY

      if (
        deltaY < 0 &&
        viewBoxWidth - 2 * Math.abs(deltaY * dynamicFactor) < MIN_VIEWBOX_MS
      ) {
        const center = (startX.get() + endX.get()) / 2

        startX.set(
          ensureInBounds(
            center - MIN_VIEWBOX_MS / 2,
            options.domain[0],
            options.domain[options.domain.length - 1] - MIN_VIEWBOX_MS,
          ),
        )
        endX.set(
          ensureInBounds(
            center + MIN_VIEWBOX_MS / 2,
            options.domain[0] + MIN_VIEWBOX_MS,
            options.domain[options.domain.length - 1],
          ),
        )
      } else {
        const focusX = interpolate(
          0,
          width.get(),
          startX.get(),
          endX.get(),
          event.clientX,
        )
        const shiftStartX = interpolate(
          focusX,
          focusX + viewBoxWidth / 2,
          0,
          deltaY * dynamicFactor,
          startX.get(),
        )
        const shiftEndX = interpolate(
          focusX,
          focusX + viewBoxWidth / 2,
          0,
          deltaY * dynamicFactor,
          endX.get(),
        )

        startX.set(
          ensureInBounds(
            startX.get() + shiftStartX,
            options.domain[0],
            options.domain[options.domain.length - 1] - MIN_VIEWBOX_MS,
          ),
        )
        endX.set(
          ensureInBounds(
            endX.get() + shiftEndX,
            startX.get() + MIN_VIEWBOX_MS,
            options.domain[options.domain.length - 1],
          ),
        )
      }
    } else if (
      angle >= -DEVIATION_FROM_STRAIGHT_LINE_DEGREES &&
      angle <= DEVIATION_FROM_STRAIGHT_LINE_DEGREES // left, right
    ) {
      startX.set(
        ensureInBounds(
          startX.get() + event.deltaX * dynamicFactor,
          options.domain[0],
          options.domain[options.domain.length - 1] - viewBoxWidth,
        ),
      )
      endX.set(
        ensureInBounds(
          startX.get() + viewBoxWidth,
          options.domain[0],
          options.domain[options.domain.length - 1],
        ),
      )
    }
  }

  function createDOM() {
    const element = document.createElement('div')

    element.style.display = 'flex'
    element.style.flexDirection = 'column'

    const series = Series(options, context)
    const markers = Markers(
      {
        startX,
        endX,
        markers: options.markers,
        width,
        height: context.canvasHeight,
        min: context.inertVisibleMin,
        max: context.inertVisibleMax,
        startIndex: context.startIndex,
        endIndex: context.endIndex,
      },
      context,
    )
    const overview = Overview(options, context)
    const controls = Controls(options, context)
    const tooltip = Tooltip(options, context)
    const xAxis = XAxis(options, context)
    const yAxis = YAxis(options, context)

    series.element.appendChild(tooltip.element)
    series.element.appendChild(markers.element)
    element.appendChild(series.element)
    element.appendChild(xAxis.element)
    element.appendChild(yAxis.element)
    element.appendChild(overview.element)
    element.appendChild(controls.element)

    return {
      element,
    }
  }
}
