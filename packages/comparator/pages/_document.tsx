import { createPalette, isServer } from '@pavel/utils'
import { Html, Head, Main, NextScript } from 'next/document'

function getPxPerRem() {
  if (isServer) {
    return 16
  }

  const root = document.querySelector('html')
  return Number(getComputedStyle(root).fontSize.slice(0, -2))
}

function buildClamp(
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

const spaces = {
  '--space-100': {
    width: [320, 1440],
    value: [0.75, 1],
  },
  '--space-125': {
    width: [320, 1440],
    value: [1, 1.25],
  },
  '--space-175': {
    width: [320, 1440],
    value: [1.125, 1.75],
  },
  '--space-200-wider': {
    width: [320, 1440],
    value: [1, 2],
  },
  '--space-200': {
    width: [320, 1440],
    value: [1, 2],
  },
  '--space-250': {
    width: [320, 1440],
    value: [1.5, 2.5],
  },
  '--space-300': {
    width: [320, 1440],
    value: [1, 3],
  },
  '--space-500': {
    width: [320, 1440],
    value: [2, 5],
  },
}

function getCustomProperties() {
  const result = {}

  for (const [
    key,
    {
      width: [minWidth, maxWidth],
      value: [minValue, maxValue],
    },
  ] of Object.entries(spaces)) {
    const property = buildClamp(minWidth, maxWidth, minValue, maxValue)
    result[key] = property
  }

  return {
    ...result,
    ...createPalette({
      hue: 228,
      baseSaturation: 0,
      lightnessSteps: 21,
      name: '--c-0',
    }),
    ...createPalette({
      hue: 228,
      baseSaturation: 6,
      lightnessSteps: 21,
      name: '--c-1',
    }),
  }
}

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head />
      <body style={getCustomProperties()}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
