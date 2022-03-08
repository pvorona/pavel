import {
  ChartOptions,
  ChartOptionsUnvalidated,
  ColorsOptions,
  DomainOptions,
  DomainOptionsUnvalidated,
  OverviewOptions,
  TooltipOptions,
  ViewBoxOptions,
  XOptions,
  YOptions,
} from '../types'
import { assertColor } from './assertColor'
import { assertNonNegativeNumber } from './assertNonNegativeNumber'
import { assertNonNegativeInt } from './assertNonNegativeInt'
import { compute, observable } from '@pavel/observable'
import { DataByGraphName, DataByGraphNameUnvalidated } from '..'

export function validateConfig(options: ChartOptionsUnvalidated): ChartOptions {
  const domain = validateDomainOptions(options.domain)

  return {
    x: validateXOptions(options.x),
    y: validateYOptions(options.y),
    overview: validateOverviewOptions(options.overview),
    tooltip: validateTooltipOptions(options.tooltip),
    viewBox: validateViewBoxOptions(options.viewBox),
    visibility: options.visibility,
    lineWidth: assertNonNegativeInt(options.lineWidth),
    colors: validateColorsOptions(options.colors),
    data: validateDataOptions(options.data),
    domain,
    lineJoin: options.lineJoin,
    lineCap: options.lineCap,
    graphNames: options.graphNames,
    total: compute([domain], domain => domain.length),
    width: options.width,
    height: options.height,
  }
}

export function validateDataOptions(
  options: DataByGraphNameUnvalidated,
): DataByGraphName {
  const result: Record<string, number[]> = {}

  for (const [key, value] of Object.entries(options)) {
    result[key] = value
  }

  return observable(result)
}

export function validateDomainOptions(
  options: DomainOptionsUnvalidated,
): DomainOptions {
  return observable(options)
}

export function validateXOptions(options: XOptions): XOptions {
  return {
    color: assertColor(options.color),
    ticks: assertNonNegativeInt(options.ticks),
    tick: {
      height: assertNonNegativeNumber(options.tick.height),
      margin: assertNonNegativeNumber(options.tick.margin),
    },
    label: {
      fontSize: assertNonNegativeNumber(options.label.fontSize),
      fontFamily: options.label.fontFamily,
    },
    marginBottom: assertNonNegativeNumber(options.marginBottom),
    marginTop: assertNonNegativeNumber(options.marginTop),
  }
}

export function validateYOptions(options: YOptions): YOptions {
  return {
    color: assertColor(options.color),
    ticks: assertNonNegativeInt(options.ticks),
    label: {
      color: assertColor(options.label.color),
      fontSize: assertNonNegativeNumber(options.label.fontSize),
      fontFamily: options.label.fontFamily,
      marginBottom: options.label.marginBottom,
      marginLeft: options.label.marginLeft,
    },
  }
}

export function validateOverviewOptions(
  options: OverviewOptions,
): OverviewOptions {
  return {
    height: assertNonNegativeNumber(options.height),
    lineWidth: assertNonNegativeInt(options.lineWidth),
    overlayColor: assertColor(options.overlayColor),
    edgeColor: assertColor(options.edgeColor),
  }
}

export function validateTooltipOptions(
  options: TooltipOptions,
): TooltipOptions {
  return {
    lineColor: assertColor(options.lineColor),
    backgroundColor: assertColor(options.backgroundColor),
    color: assertColor(options.color),
  }
}

export function validateViewBoxOptions(
  options: ViewBoxOptions,
): ViewBoxOptions {
  return {
    startIndex: assertNonNegativeNumber(options.startIndex),
    endIndex: assertNonNegativeNumber(options.endIndex),
  }
}

export function validateColorsOptions(options: ColorsOptions): ColorsOptions {
  const result = {} as ColorsOptions

  for (const graphName in options) {
    result[graphName] = assertColor(options[graphName])
  }

  return result
}
