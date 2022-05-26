import { InternalChartOptions } from '../../types'
import { hexToRGB, toBitMapSize, toScreenY } from '../../util'
import { Point } from '../types'
import { lineTo } from './lineTo'

const MARGIN_OVERSHOOT = 1
const TRANSPARENT = `rgba(0,0,0,0)`

export function renderLineSeriesWithAreaGradient({
  context,
  points,
  graphs,
  lineWidth,
  colors,
  opacityState,
  lineJoin,
  lineCap,
  width,
  height,
  minMaxByGraphKey,
  min,
  max,
}: {
  context: CanvasRenderingContext2D
  points: { [key: string]: Point[] }
  graphs: InternalChartOptions['graphs']
  lineWidth: InternalChartOptions['lineWidth']
  colors: InternalChartOptions['colors']
  opacityState: { [key: string]: number }
  lineJoin: InternalChartOptions['lineJoin']
  lineCap: InternalChartOptions['lineCap']
  width: number
  height: number
  minMaxByGraphKey: Record<string, { min: number; max: number }>
  min: number
  max: number
}) {
  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i]
    const opacity = opacityState[graph.key]

    if (opacity === 0) continue

    const color = colors[i % graphs.length]
    const rgbColor = `rgba(${hexToRGB(color)},${opacity})`
    const gradientColorStart = `rgba(${hexToRGB(color)},${opacity / 4})`
    const gradientColorStop = `rgba(${hexToRGB(color)},${opacity / 32})`

    context.strokeStyle = rgbColor
    context.lineWidth = toBitMapSize(lineWidth)
    context.lineJoin = lineJoin
    context.lineCap = lineCap
    context.beginPath()

    for (let j = 0; j < points[graph.key].length; j++) {
      const { x, y } = points[graph.key][j]

      lineTo(context, toBitMapSize(x), toBitMapSize(y))

      if (j === points[graph.key].length - 1) {
        const yStart = toScreenY(
          min,
          max,
          0,
          height,
          minMaxByGraphKey[graph.key].max,
        )

        const gradient = context.createLinearGradient(
          0,
          // Ignore line width for now
          toBitMapSize(yStart),
          0,
          toBitMapSize(height),
        )
        gradient.addColorStop(0, gradientColorStart)
        gradient.addColorStop(0.5, gradientColorStop)
        gradient.addColorStop(1, TRANSPARENT)

        lineTo(context, toBitMapSize(width + MARGIN_OVERSHOOT), toBitMapSize(y))
        lineTo(
          context,
          toBitMapSize(width + MARGIN_OVERSHOOT),
          toBitMapSize(height + MARGIN_OVERSHOOT),
        )
        lineTo(
          context,
          toBitMapSize(0 - MARGIN_OVERSHOOT),
          toBitMapSize(height + MARGIN_OVERSHOOT),
        )
        lineTo(
          context,
          toBitMapSize(0 - MARGIN_OVERSHOOT),
          toBitMapSize(points[graph.key][0].y),
        )
        context.fillStyle = gradient
        context.fill()
      }
    }

    context.stroke()
  }
}
