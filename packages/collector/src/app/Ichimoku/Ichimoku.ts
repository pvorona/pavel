import { Candle } from '../types'

export type IchimokuOptions = {
  conversionPeriod?: number
  basePeriod?: number
  spanPeriod?: number
  displacement?: number
  values?: Candle[]
}

export type IchimokuValue = {
  conversion: number
  base: number
  spanA: number
  spanB: number
}

export const DEFAULT_OPTIONS = {
  conversionPeriod: 9,
  basePeriod: 26,
  spanPeriod: 52,
  displacement: 26,
} as const

export function createIchimoku(input?: IchimokuOptions) {
  const params = Object.assign({}, DEFAULT_OPTIONS, input)
  const generator = (function* () {
    let result: IchimokuValue
    let tick: Candle

    const period = Math.max(
      params.conversionPeriod,
      params.basePeriod,
      params.spanPeriod,
      params.displacement,
    )
    let periodCounter = 0
    let spanCounter = 0
    const highs = []
    const lows = []
    const spanAs = []
    const spanBs = []

    let conversionPeriodLow: number, conversionPeriodHigh: number
    let basePeriodLow: number, basePeriodHigh: number
    let spanbPeriodLow: number, spanbPeriodHigh: number

    tick = yield

    while (true) {
      // Keep a list of lows/highs for the max period
      highs.push(tick.high)
      lows.push(tick.low)

      if (periodCounter < period) {
        periodCounter++
      } else {
        highs.shift()
        lows.shift()

        // TODO
        // - Can use loop instead of slice to reduce performance overhead
        // Tenkan-sen (ConversionLine): (9-period high + 9-period low)/2))
        conversionPeriodLow = lows
          .slice(-params.conversionPeriod)
          .reduce((a, b) => Math.min(a, b))
        conversionPeriodHigh = highs
          .slice(-params.conversionPeriod)
          .reduce((a, b) => Math.max(a, b))
        const conversionLine = (conversionPeriodHigh + conversionPeriodLow) / 2

        // Kijun-sen (Base Line): (26-period high + 26-period low)/2))
        basePeriodLow = lows
          .slice(-params.basePeriod)
          .reduce((a, b) => Math.min(a, b))
        basePeriodHigh = highs
          .slice(-params.basePeriod)
          .reduce((a, b) => Math.max(a, b))
        const baseLine = (basePeriodHigh + basePeriodLow) / 2

        // Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2))
        let spanA = 0
        spanAs.push((conversionLine + baseLine) / 2)

        // Senkou Span B (Leading Span B): (52-period high + 52-period low)/2))
        let spanB = 0
        spanbPeriodLow = lows
          .slice(-params.spanPeriod)
          .reduce((a, b) => Math.min(a, b))
        spanbPeriodHigh = highs
          .slice(-params.spanPeriod)
          .reduce((a, b) => Math.max(a, b))
        spanBs.push((spanbPeriodHigh + spanbPeriodLow) / 2)

        // Senkou Span A / Senkou Span B offset by 26 periods
        if (spanCounter < params.displacement) {
          spanCounter++
        } else {
          spanA = spanAs.shift()
          spanB = spanBs.shift()
        }

        result = {
          conversion: parseFloat(conversionLine.toFixed(5)),
          base: parseFloat(baseLine.toFixed(5)),
          spanA: parseFloat(spanA.toFixed(5)),
          spanB: parseFloat(spanB.toFixed(5)),
        }
      }

      tick = yield result
    }
  })()

  function nextValue(price: Candle) {
    return generator.next(price).value
  }

  return { nextValue }
}
