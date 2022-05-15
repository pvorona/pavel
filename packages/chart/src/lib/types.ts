import { DeepPartial, DeepRequired, Nominal } from '@pavel/types'
import { ChartContext } from './components'

export interface VisibilityState {
  readonly [key: string]: boolean
}

export interface DataByGraphName {
  readonly [key: string]: readonly number[]
}

type BlockMarginTrait = {
  blockStart?: number
  blockEnd?: number
}

type InlineMarginTrait = {
  inlineStart?: number
  inlineEnd?: number
}

type Margin = BlockMarginTrait & InlineMarginTrait

export type XOptions = {
  margin: Margin
  ticks: number
  label: {
    color: string
    fontSize: number
    fontFamily: string
  }
}

export type YOptions = {
  color: string
  ticks: number
  label: {
    color: string
    fontSize: number
    fontFamily: string
    margin?: Margin
  }
}

export type OverviewOptions = {
  readonly height: number
  readonly lineWidth: number
  readonly overlayColor: string
  readonly edgeColor: string
}

export type TooltipOptions = {
  readonly lineColor: string
  readonly backgroundColor: string
  readonly color: string
}

export type ViewBoxOptions = {
  readonly start: number
  readonly end: number
}

export type ColorsOptions = { [key: string]: string }

export type OptionalChartOptions = {
  readonly x: XOptions
  readonly y: YOptions
  readonly overview: OverviewOptions
  readonly tooltip: TooltipOptions
  readonly lineWidth: number
  readonly colors: readonly string[]
  readonly lineJoin: CanvasLineJoin
  readonly lineCap: CanvasLineCap
}

export type ExternalChartOptions = DeepPartial<OptionalChartOptions> & {
  readonly viewBox: ViewBoxOptions
  readonly visibility: VisibilityState
  readonly total: number
  readonly width: number
  readonly height: number
  readonly data: DataByGraphName
  readonly domain: readonly number[]
  readonly graphNames: readonly string[]
}

export type InternalChartOptions = DeepRequired<ExternalChartOptions>

// type Series = {
//   title?: string
//   series?: number[]
//   color?: string
//   isVisible?: boolean
// }

// const graphs = [{
//   title: 'A',
//   data: [1, 2],
//   color: 'red',
//   visible: true,
// }]

// type LineWidth = 1 | 2 | 3 | 4;
// type LineStyle = 'solid' | 'dashed'

// type Series = {
//   // title?: string;
//   // axisLabelVisible
//   data?: number[];
//   color?: string;
//   // Are series visible on initial render
//   // Default: true
//   visible?: boolean;
//   lineJoin: CanvasLineJoin;
//   lineWidth: LineWidth;
//   lineStyle?: LineStyle
// };

export type BitMapSize = Nominal<number, 'BitMapSize'>

export type ChartContext = ReturnType<typeof ChartContext>
