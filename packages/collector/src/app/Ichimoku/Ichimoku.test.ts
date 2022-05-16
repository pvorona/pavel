import { createIchimoku } from './Ichimoku'
import { data as candles } from './data'

describe('Ichimoku', () => {
  const ichimoku = createIchimoku({
    conversionPeriod: 9,
    basePeriod: 26,
    spanPeriod: 52,
  })

  let ichimokuValue = {}
  let ichimokuValues = []

  beforeEach(() => {
    for (const candle of candles) {
      ichimokuValues.push(
        ichimoku.nextValue({
          high: Number(candle.mid.h),
          low: Number(candle.mid.l),
          close: Number(candle.mid.c),
        }),
      )
    }

    ichimokuValue = ichimokuValues.slice(-1).pop()
    ichimokuValues = ichimokuValues.slice(-10)
  })

  it('should return a conversion line', () => {
    expect(ichimokuValue).toHaveProperty('conversion')
  })

  it('should return a base line', () => {
    expect(ichimokuValue).toHaveProperty('base')
  })

  it('should return a Span A line', () => {
    expect(ichimokuValue).toHaveProperty('spanA')
  })

  it('should return a Span B line', () => {
    expect(ichimokuValue).toHaveProperty('spanB')
  })

  it('should calculate the correct line values', () => {
    expect(ichimokuValues).toStrictEqual([
      {
        conversion: 1.3393,
        base: 1.33666,
        spanA: 1.3376,
        spanB: 1.33744,
      },
      {
        conversion: 1.33921,
        base: 1.33666,
        spanA: 1.33748,
        spanB: 1.33744,
      },
      {
        conversion: 1.33899,
        base: 1.33666,
        spanA: 1.33752,
        spanB: 1.33744,
      },
      {
        conversion: 1.33899,
        base: 1.33666,
        spanA: 1.33759,
        spanB: 1.33736,
      },
      {
        conversion: 1.339,
        base: 1.33668,
        spanA: 1.33783,
        spanB: 1.33736,
      },
      {
        conversion: 1.33956,
        base: 1.33723,
        spanA: 1.33791,
        spanB: 1.33736,
      },
      {
        conversion: 1.33956,
        base: 1.33723,
        spanA: 1.33791,
        spanB: 1.33736,
      },
      {
        conversion: 1.33956,
        base: 1.33723,
        spanA: 1.33771,
        spanB: 1.33736,
      },
      {
        conversion: 1.33982,
        base: 1.3375,
        spanA: 1.33771,
        spanB: 1.33716,
      },
      {
        conversion: 1.33982,
        base: 1.3375,
        spanA: 1.33811,
        spanB: 1.33709,
      },
    ])
  })
})
