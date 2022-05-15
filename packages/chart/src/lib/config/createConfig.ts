import { merge } from 'lodash'
import { ExternalChartOptions, InternalChartOptions } from '../types'
import { DEFAULT_CHART_OPTIONS } from './constants'

export function createConfig(
  options: ExternalChartOptions,
): InternalChartOptions {
  return merge(DEFAULT_CHART_OPTIONS, options) as InternalChartOptions
}
