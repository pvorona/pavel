import { observable } from '@pavel/observable'
import { ChartContext, InternalChartOptions } from '../../../types'
import { Markers } from '../../Markers'
import { Component } from '../../types'
import { Graphs } from '../Graphs'
import { RangeSlider } from '../RangeSlider'

import './overview.css'

export const Overview: Component<InternalChartOptions, ChartContext> = (
  options,
  context,
) => {
  const { element } = createDom()

  return { element }

  function createDom() {
    const containerClassName = 'overview'
    const element = document.createElement('div')

    element.className = containerClassName
    element.style.height = `${options.overview.height}px`

    const graphs = Graphs(options, context)
    const markers = Markers(
      {
        startX: context.globalStartX,
        endX: context.globalEndX,
        markers: options.markers,
        width: context.width,
        height: observable(options.overview.height),
        min: context.globalMin,
        max: context.globalMax,
      },
      context,
    )
    const rangeSlider = RangeSlider(options, context)

    element.appendChild(graphs.element)
    element.appendChild(markers.element)
    element.appendChild(rangeSlider.element)

    return {
      element,
    }
  }
}
