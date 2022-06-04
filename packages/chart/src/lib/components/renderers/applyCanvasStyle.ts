import { LineWidth } from '../../types'
import { toBitMapSize } from '../../util'
import { applyAlpha } from '../../util/color'

export function applyCanvasStyle(
  context: CanvasRenderingContext2D,
  {
    opacity = 1,
    strokeStyle,
    fillStyle,
    lineWidth,
    lineJoin,
    lineCap,
    lineDash,
  }: {
    readonly opacity?: number
    readonly strokeStyle?: string
    readonly fillStyle?: string
    readonly lineWidth?: LineWidth
    readonly lineJoin?: CanvasLineJoin
    readonly lineCap?: CanvasLineCap
    readonly lineDash?: readonly number[]
  },
) {
  if (strokeStyle) {
    context.strokeStyle = applyAlpha(strokeStyle, opacity)
  }

  if (fillStyle) {
    context.fillStyle = applyAlpha(fillStyle, opacity)
  }

  if (lineWidth) {
    context.lineWidth = toBitMapSize(lineWidth)
  }

  if (lineJoin) {
    context.lineJoin = lineJoin
  }

  if (lineCap) {
    context.lineCap = lineCap
  }

  if (lineDash) {
    context.setLineDash(lineDash as number[])
  }
}
