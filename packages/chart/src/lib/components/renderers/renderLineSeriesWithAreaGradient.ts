import { InternalChartOptions } from '../../types'
import { hexToRGB, toBitMapSize, toScreenY } from '../../util'
import { Point } from '../types'
import { lineTo } from './lineTo'

const MARGIN_OVERSHOOT = 1
const TRANSPARENT = `rgba(0,0,0,0)`

export function renderLineSeriesWithAreaGradient({
  context,
  points,
  graphNames,
  lineWidth,
  colors,
  opacityState,
  lineJoin,
  lineCap,
  width,
  height,
  minMaxByGraphName,
  min,
  max,
}: {
  context: CanvasRenderingContext2D
  points: { [key: string]: Point[] }
  graphNames: InternalChartOptions['graphNames']
  lineWidth: InternalChartOptions['lineWidth']
  colors: InternalChartOptions['colors']
  opacityState: { [key: string]: number }
  lineJoin: InternalChartOptions['lineJoin']
  lineCap: InternalChartOptions['lineCap']
  width: number
  height: number
  minMaxByGraphName: Record<string, { min: number; max: number }>
  min: number
  max: number
}) {
  for (let i = 0; i < graphNames.length; i++) {
    const graphName = graphNames[i]
    const opacity = opacityState[graphName]

    if (opacity === 0) continue

    const color = colors[i % graphNames.length]
    const rgbColor = `rgba(${hexToRGB(color)},${opacity})`
    const gradientColorStart = `rgba(${hexToRGB(color)},${opacity / 4})`
    const gradientColorStop = `rgba(${hexToRGB(color)},${opacity / 32})`

    context.strokeStyle = rgbColor
    context.lineWidth = toBitMapSize(lineWidth)
    context.lineJoin = lineJoin
    context.lineCap = lineCap
    context.beginPath()

    for (let j = 0; j < points[graphName].length; j++) {
      const { x, y } = points[graphName][j]

      lineTo(context, toBitMapSize(x), toBitMapSize(y))

      if (j === points[graphName].length - 1) {
        const yStart = toScreenY(
          min,
          max,
          0,
          height,
          minMaxByGraphName[graphName].max,
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
          toBitMapSize(points[graphName][0].y),
        )
        context.fillStyle = gradient
        context.fill()
      }
    }

    context.stroke()
  }
}
