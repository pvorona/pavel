import { createPalette } from '@pavel/utils'
import { Html, Head, Main, NextScript } from 'next/document'

function getCustomProperties() {
  return {
    ...createPalette({
      hue: 228,
      baseSaturation: 0,
      lightnessSteps: 21,
      name: '--c-0',
    }),
    ...createPalette({
      hue: 228,
      baseSaturation: 5,
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
