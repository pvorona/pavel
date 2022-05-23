import { DeepPartial, DeepRequired, Nominal } from '@pavel/types'
import { ChartContext } from './components'

export type VisibilityState = {
  readonly [key: string]: boolean
}

export type Graph =
  | {
      readonly key: string
      readonly label?: string
    }
  | string

export type DataArrayTrait = {
  readonly domain: string
  readonly data: DataArray
}

export type DataObjectTrait = {
  readonly domain: readonly number[]
  readonly data: {
    readonly [graph: string]: readonly number[]
  }
}

export type DataTrait = DataArrayTrait | DataObjectTrait

export type DataArray = readonly {
  readonly [domainOrSeriesKey: string]: number
}[]

export type DataObject = {
  readonly domain: readonly number[]
  values: {
    readonly [graph: string]: readonly number[]
  }
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

type LineWidth = 1 | 2 | 3 | 4

export type ColorsOptions = { [key: string]: string }

export type ExternalGraph =
  | {
      readonly key: string
      readonly label?: string
    }
  | string

export type InternalGraph = {
  readonly key: string
  readonly label: string
}

export type OptionalChartOptions = {
  readonly x: XOptions
  readonly y: YOptions
  readonly overview: OverviewOptions
  readonly tooltip: TooltipOptions
  readonly lineWidth: LineWidth
  readonly colors: readonly string[]
  readonly lineJoin: CanvasLineJoin
  readonly lineCap: CanvasLineCap
}

export type MappedOptions = 'graphs'

export type ExternalChartOptions = DeepPartial<OptionalChartOptions> & {
  readonly graphs: readonly ExternalGraph[]
} & DataTrait

export type InternalChartOptions = Omit<
  DeepRequired<ExternalChartOptions>,
  MappedOptions
> & {
  readonly width: number
  readonly height: number
  readonly visibility: VisibilityState
  readonly total: number
  readonly viewBox: ViewBoxOptions
  readonly graphs: InternalGraph[]
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
