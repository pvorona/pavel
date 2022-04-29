import { isServer } from './isServer'

function getPxPerRem() {
  if (isServer) {
    return 16
  }

  const root = document.querySelector('html') as HTMLHtmlElement
  return Number(getComputedStyle(root).fontSize.slice(0, -2))
}

export function createFlexSpacing(
  minWidthPx: number,
  maxWidthPx: number,
  minFontSize: number,
  maxFontSize: number,
) {
  const pixelsPerRem = getPxPerRem()
  const minWidth = minWidthPx / pixelsPerRem
  const maxWidth = maxWidthPx / pixelsPerRem

  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth)
  const yAxisIntersection = -minWidth * slope + minFontSize

  return `clamp(${minFontSize}rem, ${yAxisIntersection}rem + ${
    slope * 100
  }vw, ${maxFontSize}rem)`
}
