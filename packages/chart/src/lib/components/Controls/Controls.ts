import { ChartContext, InternalChartOptions } from '../../types'
import { Component } from '../types'

export const Controls: Component<InternalChartOptions, ChartContext> = (
  config,
  { enabledStateByGraphKey },
) => {
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.right = '20px'
  element.style.top = '20px'

  function onButtonClick(graphKey: string) {
    enabledStateByGraphKey.set({
      ...enabledStateByGraphKey.get(),
      [graphKey]: !enabledStateByGraphKey.get()[graphKey],
    })
  }

  config.graphs.forEach((graph, graphIndex) => {
    const label = document.createElement('label')
    label.style.marginRight = '15px'

    const input = document.createElement('input')
    input.checked = true
    input.type = 'checkbox'
    input.className = 'button'
    input.onclick = () => onButtonClick(graph.key)

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
