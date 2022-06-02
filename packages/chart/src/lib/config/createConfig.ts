import { assertNever, isString } from '@pavel/assert'
import { merge } from 'lodash'
import {
  DEFAULT_MARKER_COLOR,
  DEFAULT_MARKER_LINE_WIDTH,
  DEFAULT_MARKER_VISIBLE,
} from '../components/constants'
import {
  ExternalChartOptions,
  ExternalGraph,
  ExternalMarker,
  ExternalSimpleMarker,
  InternalChartOptions,
  InternalGraph,
  InternalMarker,
  InternalSimpleMarker,
  VisibilityState,
  GradientOptions,
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

  const viewBox = options.viewBox ?? {
    start: options.domain[0],
    end: options.domain[options.domain.length - 1],
  }
  const viewBoxTrait = { viewBox }

  const gradient =
    options.gradient ??
    graphs.reduce(
      (previousValue, graph) => ({
        ...previousValue,
        [graph.key]: true,
      }),
      {} as GradientOptions,
    )
  const gradientTrait = {
    gradient,
  }

  const markers = (options.markers ?? []).map(createInternalMarker)
  const markersTrait = { markers }

  return merge(
    DEFAULT_CHART_OPTIONS,
    sizeOptions,
    visibilityOptions,
    totalOptions,
    viewBoxTrait,
    gradientTrait,
    options,
    graphsTrait,
    markersTrait,
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

function createInternalSimpleMarker(
  marker: ExternalSimpleMarker,
): InternalSimpleMarker {
  if (marker.type === 'x') {
    return {
      type: marker.type,
      x: marker.x,
      lineWidth: marker.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
      color: marker.color ?? DEFAULT_MARKER_COLOR,
      lineDash: marker.lineDash,
    }
  }

  if (marker.type === 'y') {
    return {
      type: marker.type,
      y: marker.y,
      lineWidth: marker.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
      color: marker.color ?? DEFAULT_MARKER_COLOR,
    }
  }

  if (marker.type === 'rect') {
    return {
      type: marker.type,
      x: marker.x,
      y: marker.y,
      width: marker.width,
      height: marker.height,
      fill: marker.fill ?? DEFAULT_MARKER_COLOR,
      stroke: marker.stroke ?? DEFAULT_MARKER_COLOR,
      lineWidth: marker.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
    }
  }

  assertNever(marker)
}

function createInternalMarker(marker: ExternalMarker): InternalMarker {
  if (marker.type === 'group') {
    return {
      type: 'group',
      markers: marker.markers.map(createInternalSimpleMarker),
      label: marker.label,
      color: marker.color ?? DEFAULT_MARKER_COLOR,
      visible: marker.visible ?? DEFAULT_MARKER_VISIBLE,
    }
  }

  return createInternalSimpleMarker(marker)
}
