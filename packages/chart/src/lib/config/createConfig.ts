import { merge } from 'lodash'
import {
  ExternalChartOptions,
  GradientOptions,
  InternalChartOptions,
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

  const visibility = options.graphNames.reduce(
    (accumulated, series) => ({
      ...accumulated,
      [series]: true,
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

  const gradient = options.graphNames.reduce(
    (accumulated, series) => ({
      ...accumulated,
      [series]: true,
    }),
    {} as GradientOptions,
  )
  const gradientOptions = {
    gradient,
  }

  return merge(
    DEFAULT_CHART_OPTIONS,
    sizeOptions,
    visibilityOptions,
    totalOptions,
    viewBoxOptions,
    gradientOptions,
    options,
  ) as InternalChartOptions
}
