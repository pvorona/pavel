import { isString, isArray } from '@pavel/assert'
import { merge } from 'lodash'
import {
  DataArrayTrait,
  DataObjectTrait,
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

  const viewBoxOptions = {
    viewBox: {
      start: getDomainValueAt(options, 0),
      end: getDomainValueAt(options, getTotalItems(options) - 1),
    },
  }

  return merge(
    DEFAULT_CHART_OPTIONS,
    sizeOptions,
    visibilityOptions,
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

export function isDataArray(
  options: DataArrayTrait | DataObjectTrait,
): options is DataArrayTrait {
  return isArray(options.data)
}

export function isDataObject(
  options: DataArrayTrait | DataObjectTrait,
): options is DataObjectTrait {
  return 'domain' in options
}

export function getTotalItems(options: ExternalChartOptions): number {
  if (isDataArray(options)) {
    return options.data.length
  }

  return options.domain.length
}

export function getDomainValueAt(
  options: ExternalChartOptions,
  index: number,
): number {
  if (isDataArray(options)) {
    return options.data[index][options.domain]
  }

  return options.domain[index]
}
