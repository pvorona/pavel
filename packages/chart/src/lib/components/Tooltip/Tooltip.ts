import { effect, computeLazy } from '@pavel/observable'
import { ChartContext, InternalChartOptions } from '../../types'
import { getTooltipDateText } from '../../util'
import { DOT_SIZE, CENTER_OFFSET as DOT_CENTER_OFFSET } from '../constants'
import { Component, Point } from '../types'

import './TooltipLine.css'
import './Title.css'
import './Tooltip.css'

export const Tooltip: Component<InternalChartOptions, ChartContext> = (
  options,
  {
    isHovering,
    isDragging,
    isWheeling,
    isGrabbingGraphs,
    isAnyGraphEnabled,
    enabledGraphKeys,
    mainGraphPoints,
    startIndex,
    mouseX,
  },
) => {
  const {
    tooltipContainer,
    tooltipCircles,
    tooltipLine,
    tooltip,
    tooltipValues,
    tooltipGraphInfo,
    tooltipDate,
  } = createDOM()

  // why lazy
  const isTooltipVisible = computeLazy(
    [isDragging, isHovering, isWheeling, isGrabbingGraphs, isAnyGraphEnabled],
    function isTooltipVisibleCompute(
      isDragging,
      isHovering,
      isWheeling,
      isGrabbingGraphs,
      isAnyGraphEnabled,
    ) {
      return (
        !isWheeling &&
        !isDragging &&
        isHovering &&
        !isGrabbingGraphs &&
        isAnyGraphEnabled
      )
    },
  )

  effect([isTooltipVisible], isTooltipVisible => {
    if (isTooltipVisible) {
      tooltipLine.style.visibility = 'visible'
      tooltip.style.display = 'block'

      // Test if it makes sense to extract effect functions outside of this effect
      // can use binary search here
      const tooltipIndex = computeLazy(
        [mouseX, mainGraphPoints],
        function tooltipIndexCompute(x, points) {
          let closestPointIndex = 0
          for (let i = 1; i < points[options.graphs[0].key].length; i++) {
            const distance = Math.abs(points[options.graphs[0].key][i].x - x)
            const closesDistance = Math.abs(
              points[options.graphs[0].key][closestPointIndex].x - x,
            )
            if (distance < closesDistance) closestPointIndex = i
          }
          return closestPointIndex
        },
      )

      const updateTooltipPositionAndTextEffectUnobserve = effect(
        [mainGraphPoints, enabledGraphKeys, tooltipIndex, startIndex],
        updateTooltipPositionAndText,
      )

      const updateTooltipCirclesVisibilityEffectUnobserve = effect(
        [enabledGraphKeys],
        enabledGraphKeys => {
          options.graphs.forEach(
            graph =>
              (tooltipCircles[graph.key].style.visibility =
                enabledGraphKeys.indexOf(graph.key) > -1 ? 'visible' : ''),
          )
        },
      )

      const updateTooltipGraphInfoEffectUnobserve = effect(
        [enabledGraphKeys],
        enabledGraphKeys => {
          options.graphs.forEach(graph => {
            tooltipGraphInfo[graph.key].hidden = !enabledGraphKeys.includes(
              graph.key,
            )
          })
        },
      )

      return () => {
        tooltipLine.style.visibility = ''
        tooltip.style.display = ''

        options.graphs.forEach(graph => {
          tooltipCircles[graph.key].style.visibility = ''
        })

        updateTooltipPositionAndTextEffectUnobserve()
        updateTooltipCirclesVisibilityEffectUnobserve()
        updateTooltipGraphInfoEffectUnobserve()
      }
    }
  })

  return { element: tooltipContainer }

  function updateTooltipPositionAndText(
    points: Record<string, Point[]>,
    enabledGraphKeys: string[],
    index: number,
    startIndex: number,
  ) {
    const { x } = points[enabledGraphKeys[0]][index]
    tooltipLine.style.transform = `translateX(${x}px)`
    const dataIndex = index + Math.floor(startIndex)
    for (let i = 0; i < enabledGraphKeys.length; i++) {
      const { x, y } = points[enabledGraphKeys[i]][index]
      tooltipCircles[enabledGraphKeys[i]].style.transform = `translateX(${
        x + DOT_CENTER_OFFSET
      }px) translateY(${y + DOT_CENTER_OFFSET}px)`
      tooltipValues[enabledGraphKeys[i]].innerText = String(
        options.data[enabledGraphKeys[i]][dataIndex],
      )
    }
    tooltipDate.innerText = getTooltipDateText(options.domain[dataIndex])
    tooltip.style.transform = `translateX(calc(${x}px - 50%))`
  }

  function createDOM() {
    const tooltip = document.createElement('div')
    tooltip.style.backgroundColor = options.tooltip.backgroundColor
    tooltip.style.color = options.tooltip.color
    tooltip.className = 'tooltip'

    const tooltipDate = document.createElement('div')
    tooltipDate.style.padding = '12px 16px 0'
    tooltip.appendChild(tooltipDate)

    const tooltipLegendContainer = document.createElement('div')
    tooltipLegendContainer.className = 'tooltip__legend'
    tooltip.appendChild(tooltipLegendContainer)

    const tooltipValues: { [key: string]: HTMLDivElement } = {}
    const tooltipGraphInfos: { [key: string]: HTMLDivElement } = {}
    options.graphs.forEach((graph, graphIndex) => {
      const color = options.colors[graphIndex % options.graphs.length]

      const tooltipGraphInfo = document.createElement('div')
      tooltipGraphInfo.style.color = color
      tooltipGraphInfo.style.padding = '0 16px 12px'
      tooltipGraphInfos[graph.key] = tooltipGraphInfo

      const graphLabelElement = document.createElement('div')
      graphLabelElement.innerText = graph.label
      graphLabelElement.style.fontWeight = 'bold'
      tooltipGraphInfo.appendChild(graphLabelElement)

      const tooltipValue = document.createElement('div')
      tooltipValue.style.marginTop = '4px'
      tooltipGraphInfo.appendChild(tooltipValue)

      tooltipValues[graph.key] = tooltipValue
      tooltipLegendContainer.appendChild(tooltipGraphInfo)
    })

    const tooltipContainer = document.createElement('div')
    const tooltipLine = document.createElement('div')
    tooltipLine.style.backgroundColor = options.tooltip.lineColor
    tooltipLine.className = 'tooltip-line'
    tooltipContainer.appendChild(tooltipLine)

    const tooltipCircles: { [key: string]: HTMLDivElement } = {}
    for (let i = 0; i < options.graphs.length; i++) {
      const color = options.colors[i % options.graphs.length]
      const circle = document.createElement('div')
      circle.style.width = `${DOT_SIZE}px`
      circle.style.height = `${DOT_SIZE}px`
      circle.style.borderColor = color
      circle.style.backgroundColor = color
      circle.className = 'tooltip__dot'
      tooltipCircles[options.graphs[i].key] = circle
      tooltipContainer.appendChild(circle)
    }

    tooltipContainer.appendChild(tooltip)

    return {
      tooltip,
      tooltipContainer,
      tooltipLine,
      tooltipCircles,
      tooltipValues,
      tooltipGraphInfo: tooltipGraphInfos,
      tooltipDate,
    }
  }
}
