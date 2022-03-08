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

export const Chart = (parent: HTMLElement, uncheckedOptions: ChartOptions) => {
  const options = validateConfig(uncheckedOptions)
  const context = ChartContext(options)
  const { width, height } = context
  const { element } = createDOM()

  parent.appendChild(element)

  const resizeListener = throttleTask(function measureContainerSize() {
    width.value = parent.offsetWidth
    height.value = parent.offsetHeight
  }, PRIORITY.READ)

  window.addEventListener('resize', resizeListener)

  return { element, destroy }

  function destroy() {
    window.removeEventListener('resize', resizeListener)
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
