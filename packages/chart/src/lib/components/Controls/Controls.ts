import { ChartContext, InternalChartOptions } from '../../types'
import { getMarkerVisibility } from '../../util'
import { Component } from '../types'

export const Controls: Component<InternalChartOptions, ChartContext> = (
  config,
  { enabledStateByGraphKey, enabledStateByMarkerIndex },
) => {
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.right = '20px'
  element.style.top = '20px'
  element.style.display = 'flex'
  element.style.gap = '14px'
  element.style.alignItems = 'center'

  function handleGraphButtonClick(graphKey: string) {
    enabledStateByGraphKey.set({
      ...enabledStateByGraphKey.get(),
      [graphKey]: !enabledStateByGraphKey.get()[graphKey],
    })
  }

  function handleMarkerGroupButtonClick(markerIndex: number) {
    enabledStateByMarkerIndex.set({
      ...enabledStateByMarkerIndex.get(),
      [markerIndex]: !enabledStateByMarkerIndex.get()[markerIndex],
    })
  }

  let hasAnyGroupMarkers = false

  for (let index = 0; index < config.markers.length; index++) {
    const marker = config.markers[index]

    if (marker.type !== 'group') {
      continue
    }

    hasAnyGroupMarkers = true

    const label = document.createElement('label')

    const input = document.createElement('input')
    input.checked = true
    input.type = 'checkbox'
    input.className = 'button'
    input.checked = getMarkerVisibility(marker)
    input.onclick = () => handleMarkerGroupButtonClick(index)

    const button = document.createElement('div')
    button.className = 'like-button'
    button.style.color = marker.color

    const text = document.createElement('div')
    text.className = 'button-text'
    text.innerText = marker.label

    button.appendChild(text)
    label.appendChild(input)
    label.appendChild(button)
    element.appendChild(label)
  }

  if (hasAnyGroupMarkers) {
    const separator = document.createElement('div')
    separator.style.borderLeft = '2px solid hsl(212deg 100% 91% / 25%)'
    separator.style.height = '30px'
    element.appendChild(separator)
  }

  config.graphs.forEach((graph, graphIndex) => {
    const label = document.createElement('label')

    const input = document.createElement('input')
    input.checked = enabledStateByGraphKey.get()[graph.key]
    input.type = 'checkbox'
    input.className = 'button'
    input.onclick = () => handleGraphButtonClick(graph.key)

    const button = document.createElement('div')
    button.className = 'like-button'
    button.style.color = config.colors[graphIndex % config.graphs.length]

    const text = document.createElement('div')
    text.className = 'button-text'
    text.innerText = graph.label

    button.appendChild(text)
    label.appendChild(input)
    label.appendChild(button)
    element.appendChild(label)
  })

  return { element }
}
