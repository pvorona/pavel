import { ensureNever, isString } from '@pavel/assert'
import { Mutable } from '@pavel/types'
import { merge } from 'lodash'
import {
  DEFAULT_MARKER_COLOR,
  DEFAULT_MARKER_LINE_WIDTH,
  DEFAULT_MARKER_VISIBLE,
} from '../components/constants'
import {
  ChartOptions,
  ExternalGraph,
  ExternalMarker,
  ExternalSimpleMarker,
  InternalChartOptions,
  InternalGraph,
  InternalMarker,
  InternalSimpleMarker,
  VisibilityState,
  GradientOptions,
  ExternalLineMarker,
  InternalLineMarker,
  InternalLineWidthOptions,
  LineWidth,
} from '../types'
import {
  DEFAULT_CHART_OPTIONS,
  DEFAULT_GRAPH_VISIBILITY,
  DEFAULT_LINE_CAP,
  DEFAULT_LINE_JOIN,
  DEFAULT_LINE_WIDTH,
} from './constants'

export function createConfig(
  element: HTMLElement,
  options: ChartOptions,
): InternalChartOptions {
  const sizeOptions = {
    width: element.offsetWidth,
    height: element.offsetHeight,
  }

  const { graphs, gradient, lineWidth, visibility } = parseGraphs(
    options.graphs,
  )
  const graphsTrait = { graphs }
  const gradientTrait = { gradient }
  const lineWidthTrait = { lineWidth }
  const visibilityOptions = { visibility }

  const totalOptions = {
    total: options.domain.length,
  }

  const viewBox = options.viewBox ?? {
    start: options.domain[0],
    end: options.domain[options.domain.length - 1],
  }
  const viewBoxTrait = { viewBox }

  const markers = (options.markers ?? []).map(createInternalMarker)
  const markersTrait = { markers }

  return merge(
    DEFAULT_CHART_OPTIONS,
    sizeOptions,
    visibilityOptions,
    totalOptions,
    viewBoxTrait,
    gradientTrait,
    lineWidthTrait,
    options,
    graphsTrait,
    markersTrait,
  )
}

function parseGraphs(externalGraphs: readonly ExternalGraph[]) {
  const graphs: InternalGraph[] = []
  const gradient: Mutable<GradientOptions> = {}
  const lineWidth: Mutable<InternalLineWidthOptions> = {}
  const visibility: Mutable<VisibilityState> = {}

  for (const externalGraph of externalGraphs) {
    const graph = createInternalGraph(externalGraph)
    graphs.push(graph)

    gradient[graph.key] = hasGradient(externalGraph)
    lineWidth[graph.key] = getLineWidth(externalGraph)
    visibility[graph.key] = getGraphVisibility(externalGraph)
  }

  return { graphs, gradient, lineWidth, visibility }
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

function hasGradient(graph: ExternalGraph) {
  if (isString(graph)) {
    return false
  }

  return Boolean(graph.gradient)
}

function getLineWidth(graph: ExternalGraph): LineWidth {
  if (isString(graph)) {
    return DEFAULT_LINE_WIDTH
  }

  return graph.lineWidth ?? DEFAULT_LINE_WIDTH
}

function getGraphVisibility(graph: ExternalGraph): boolean {
  if (isString(graph)) {
    return DEFAULT_GRAPH_VISIBILITY
  }

  return graph.isVisible ?? DEFAULT_GRAPH_VISIBILITY
}

function createInternalSimpleMarker(
  marker: ExternalSimpleMarker,
): InternalSimpleMarker {
  if (marker.type === 'x') {
    return {
      type: marker.type,
      x: marker.x,
      lineWidth: marker.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
      strokeStyle: marker.strokeStyle ?? DEFAULT_MARKER_COLOR,
      lineDash: marker.lineDash,
      lineCap: DEFAULT_LINE_CAP,
      lineJoin: DEFAULT_LINE_JOIN,
    }
  }

  if (marker.type === 'y') {
    return {
      type: marker.type,
      y: marker.y,
      lineWidth: marker.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
      strokeStyle: marker.strokeStyle ?? DEFAULT_MARKER_COLOR,
      lineDash: marker.lineDash,
      lineCap: DEFAULT_LINE_CAP,
      lineJoin: DEFAULT_LINE_JOIN,
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

  if (marker.type === 'flow') {
    return {
      type: marker.type,
      domain: marker.domain,
      data: marker.data,
      lines: marker.lines.map(toInternalLine) as [
        InternalLineMarker,
        InternalLineMarker,
      ],
      fill: marker.fill ?? DEFAULT_MARKER_COLOR,
    }
  }

  ensureNever(marker)
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

function toInternalLine(line: ExternalLineMarker): InternalLineMarker {
  return {
    strokeStyle: line.strokeStyle ?? DEFAULT_MARKER_COLOR,
    lineWidth: line.lineWidth ?? DEFAULT_MARKER_LINE_WIDTH,
    lineDash: line.lineDash,
    lineCap: line.lineCap ?? DEFAULT_LINE_CAP,
    lineJoin: line.lineJoin ?? DEFAULT_LINE_JOIN,
    key: line.key,
  }
}
