import { BitMapSize } from '../../types'

export function renderLine(
  context: CanvasRenderingContext2D,
  x1: BitMapSize,
  y1: BitMapSize,
  x2: BitMapSize,
  y2: BitMapSize,
  options: {
    strokeStyle?: string
    lineWidth?: BitMapSize
    lineDash?: number[]
  },
) {
  context.save()
  context.beginPath()

  if (options.lineDash) {
    context.setLineDash(options.lineDash)
  }

  if (options.strokeStyle) {
    context.strokeStyle = options.strokeStyle
  }

  if (options.lineWidth) {
    context.lineWidth = options.lineWidth
  }

  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.restore()
}
