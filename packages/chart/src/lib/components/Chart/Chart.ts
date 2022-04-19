import { Controls } from '../Controls'
import { ChartOptions } from '../../types'
import { Overview } from '../Overview'
import { XAxis } from '../XAxis'
import { YAxis } from '../YAxis'
import { Tooltip } from '../Tooltip'
import { Series } from '../Series'
import { ChartContext } from '../Context'
import { throttleTask, PRIORITY } from '@pavel/scheduling'
import { validateConfig } from '../../config'
import {
  DEVIATION_FROM_STRAIGHT_LINE_DEGREES,
  MIN_VIEWBOX_MS,
  WHEEL_MULTIPLIER,
} from '../constants'

export const Chart = (parent: HTMLElement, uncheckedOptions: ChartOptions) => {
  const options = validateConfig(uncheckedOptions)
  const context = ChartContext(options)
  const { width, height, endX, startX, isWheeling } = context
  const { element } = createDOM()

  parent.appendChild(element)

  const resizeListener = throttleTask(function measureContainerSize() {
    width.value = parent.offsetWidth
    height.value = parent.offsetHeight
  }, PRIORITY.READ)

  window.addEventListener('resize', resizeListener)
  element.addEventListener('wheel', handleWheel)

  return { element, destroy }

  function destroy() {
    window.removeEventListener('resize', resizeListener)
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault()

    isWheeling.value = true

    const angle = (Math.atan(event.deltaY / event.deltaX) * 180) / Math.PI
    const viewBoxWidth = endX.value - startX.value
    const dynamicFactor = (viewBoxWidth / MIN_VIEWBOX_MS) * WHEEL_MULTIPLIER

    if (
      (angle < -(90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES) && angle >= -90) || // top right, bottom left
      (angle > 90 - DEVIATION_FROM_STRAIGHT_LINE_DEGREES && angle <= 90) // top left, bottom right
    ) {
      const deltaY = event.deltaY

      if (
        deltaY < 0 &&
        endX.value - startX.value - 2 * Math.abs(deltaY * dynamicFactor) <
          MIN_VIEWBOX_MS
      ) {
        const center = (endX.value + startX.value) / 2

        startX.value = center - MIN_VIEWBOX_MS / 2
        endX.value = center + MIN_VIEWBOX_MS / 2
      } else {
        startX.value = startX.value - deltaY * dynamicFactor
        endX.value = endX.value + deltaY * dynamicFactor
      }
    } else if (
      angle >= -DEVIATION_FROM_STRAIGHT_LINE_DEGREES &&
      angle <= DEVIATION_FROM_STRAIGHT_LINE_DEGREES // left, right
    ) {
      startX.value = startX.value + event.deltaX * dynamicFactor
      endX.value = startX.value + viewBoxWidth
    }
  }

  function createDOM() {
    const element = document.createElement('div')

    element.style.display = 'flex'
    element.style.flexDirection = 'column'

    const series = Series(options, context)
    const overview = Overview(options, context)
    const controls = Controls(options, context)
    const tooltip = Tooltip(options, context)
    const xAxis = XAxis(options, context)
    const yAxis = YAxis(options, context)

    series.element.appendChild(tooltip.element)
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
