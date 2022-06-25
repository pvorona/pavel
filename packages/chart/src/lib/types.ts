import { DeepPartial, DeepRequired, Nominal } from '@pavel/types'
import { ChartContext } from './components'

export type VisibilityState = {
  readonly [key: string]: boolean
}

export type GradientOptions = {
  readonly [key: string]: boolean
}

export type DataByGraphKey = {
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
  readonly lineWidth: LineWidth
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

export type ExternalGraph =
  | {
      readonly key: string
      readonly label?: string
      readonly gradient?: boolean
    }
  | string

export type InternalGraph = {
  readonly key: string
  readonly label: string
}

export type LineWidth = 1 | 2 | 3 | 4

export type ExternalLineMarkerStyle = {
  readonly strokeStyle?: string
  readonly lineWidth?: LineWidth
  readonly lineJoin?: CanvasLineJoin
  readonly lineCap?: CanvasLineCap
  readonly lineDash?: readonly number[]
}

export type ExternalXMarker = ExternalLineMarkerStyle & {
  type: 'x'
  x: number
}

export type ExternalYMarker = ExternalLineMarkerStyle & {
  type: 'y'
  y: number
}

export type ExternalRectMarker = {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  lineWidth?: LineWidth
}

export type ExternalMarkerGroup = {
  readonly type: 'group'
  readonly label: string
  readonly color?: string
  readonly markers: readonly ExternalSimpleMarker[]
  readonly visible?: boolean
}

export type ExternalLineMarker = ExternalLineMarkerStyle & {
  readonly key: string
}

export type ExternalFlowMarker = {
  readonly type: 'flow'
  readonly domain: number[]
  readonly data: Record<string, readonly number[]>
  readonly lines: [ExternalLineMarker, ExternalLineMarker]
  readonly fill?: string
}

export type ExternalSimpleMarker =
  | ExternalXMarker
  | ExternalYMarker
  | ExternalRectMarker
  | ExternalFlowMarker

export type ExternalMarker = ExternalMarkerGroup | ExternalSimpleMarker

export type InternalLineMarkerStyle = {
  readonly strokeStyle: string
  readonly lineWidth: LineWidth
  readonly lineJoin: CanvasLineJoin
  readonly lineCap: CanvasLineCap
  readonly lineDash?: readonly number[]
}

export type InternalXMarker = InternalLineMarkerStyle & {
  type: 'x'
  x: number
}

export type InternalYMarker = InternalLineMarkerStyle & {
  type: 'y'
  y: number
}

export type InternalRectMarker = {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  lineWidth: LineWidth
}

export type InternalLineMarker = InternalLineMarkerStyle & {
  readonly key: string
}

export type InternalFlowMarker = {
  readonly type: 'flow'
  readonly domain: number[]
  readonly data: Record<string, readonly number[]>
  readonly lines: [InternalLineMarker, InternalLineMarker]
  readonly fill: string
}

export type InternalSimpleMarker =
  | InternalXMarker
  | InternalYMarker
  | InternalRectMarker
  | InternalFlowMarker

export type InternalMarkerGroup = {
  readonly type: 'group'
  readonly label: string
  readonly color: string
  readonly markers: readonly InternalSimpleMarker[]
  readonly visible: boolean
}

export type InternalMarker = InternalSimpleMarker | InternalMarkerGroup

export type InternalMarkerType = InternalMarker['type']

export type DeeplyOptionalChartOptions = {
  readonly x: XOptions
  readonly y: YOptions
  readonly overview: OverviewOptions
  readonly tooltip: TooltipOptions
  readonly lineWidth: LineWidth
  readonly colors: readonly string[]
  readonly lineJoin: CanvasLineJoin
  readonly lineCap: CanvasLineCap
}

export type OptionalChartOptions = {
  readonly markers?: readonly ExternalMarker[]
  readonly viewBox?: { start: number; end: number }
}

export type MappedOptions = 'graphs' | 'gradient'

export type ExternalChartOptions = DeepPartial<DeeplyOptionalChartOptions> &
  OptionalChartOptions & {
    readonly data: DataByGraphKey
    readonly domain: readonly number[]
    readonly graphs: readonly ExternalGraph[]
  }

export type InternalChartOptions = Omit<
  DeepRequired<ExternalChartOptions>,
  MappedOptions
> & {
  readonly width: number
  readonly height: number
  readonly visibility: VisibilityState
  readonly total: number
  readonly viewBox: ViewBoxOptions
  readonly graphs: readonly InternalGraph[]
  readonly markers: readonly InternalMarker[]
  readonly gradient: GradientOptions
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

export type BitMapSize = Nominal<number, 'BitMapSize'> | 0

export type ChartContext = ReturnType<typeof ChartContext>
