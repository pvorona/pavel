import { Nominal } from '@pavel/types'
import { EagerSubject, ReadonlyEagerSubject } from '@pavel/observable'
import { ChartContext } from './components'

export type TimeSeriesDataPoint = { timestamp: number; value: number }

export interface VisibilityState {
  [key: string]: boolean
}

export type DataByGraphName = EagerSubject<{
  [key: string]: number[]
}>

export type DomainOptionsUnvalidated = number[]
export type DomainOptions = EagerSubject<number[]>

export interface DataByGraphNameUnvalidated {
  [key: string]: number[]
}

export type XOptions = {
  color: string
  ticks: number
  tick: {
    height: number
    margin: number
  }
  label: {
    fontSize: number
    fontFamily: string
  }
  marginBottom: number
  marginTop: number
}

export type YOptions = {
  color: string
  ticks: number
  label: {
    color: string
    fontSize: number
    fontFamily: string
    marginBottom: number
    marginLeft: number
  }
}

export type OverviewOptions = {
  height: number
  lineWidth: number
  overlayColor: string
  edgeColor: string
}

export type TooltipOptions = {
  lineColor: string
  backgroundColor: string
  color: string
}

export type ViewBoxOptions = {
  startIndex: number
  endIndex: number
}

export type ColorsOptions = { [key: string]: string }

export type LineJoinOptions = {
  [series: string]: CanvasLineJoin
}

export type LineCapOptions = {
  [series: string]: CanvasLineCap
}

export type ChartOptionsUnvalidated = Readonly<{
  x: XOptions
  y: YOptions
  overview: OverviewOptions
  tooltip: TooltipOptions
  viewBox: ViewBoxOptions
  visibility: VisibilityState
  width: number
  height: number
  lineWidth: number
  colors: ColorsOptions
  data: DataByGraphNameUnvalidated
  lineJoin: LineJoinOptions
  lineCap: LineCapOptions
  domain: number[]
  graphNames: string[]
}>

export type ChartOptions = {
  width: number
  height: number

  x: XOptions
  y: YOptions
  overview: OverviewOptions
  tooltip: TooltipOptions
  viewBox: ViewBoxOptions
  visibility: VisibilityState
  lineJoin: LineJoinOptions
  lineCap: LineCapOptions
  colors: ColorsOptions
  graphNames: string[]
  lineWidth: number
  data: DataByGraphName
  domain: DomainOptions
  total: ReadonlyEagerSubject<number>
}

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
