import { isString } from '@pavel/assert'
import { merge } from 'lodash'
import {
  ExternalChartOptions,
  ExternalGraph,
  InternalChartOptions,
  InternalGraph,
  VisibilityState,
} from '../types'
import { DEFAULT_CHART_OPTIONS } from './constants'

export function createConfig(
  element: HTMLElement,
  options: ExternalChartOptions,
): InternalChartOptions {
  const sizeOptions = {
    width: element.offsetWidth,
    height: element.offsetHeight,
  }

  const graphs = options.graphs.map(createInternalGraph)
  const graphsTrait = { graphs }

  const visibility = graphs.reduce(
    (accumulated, graph) => ({
      ...accumulated,
      [graph.key]: true,
    }),
    {} as VisibilityState,
  )
  const visibilityOptions = { visibility }

  const totalOptions = {
    total: options.domain.length,
  }

  const viewBoxOptions = {
    viewBox: {
      start: options.domain[0],
      end: options.domain[options.domain.length - 1],
    },
  }

  return merge(
    DEFAULT_CHART_OPTIONS,
    sizeOptions,
    visibilityOptions,
    totalOptions,
    viewBoxOptions,
    options,
    graphsTrait,
  ) as InternalChartOptions
}

function createInternalGraph(graph: ExternalGraph): InternalGraph {
  const key = getGraphKey(graph)
  const label = getGraphLabel(graph)

  return { key, label }
}

function getGraphKey(graph: ExternalGraph): string {
  if (isString(graph)) {
    return graph
  }

  return graph.key
}

function getGraphLabel(graph: ExternalGraph): string {
  if (isString(graph)) {
    return graph
  }

  if (!graph.label) {
    return graph.key
  }

  return graph.label
}
