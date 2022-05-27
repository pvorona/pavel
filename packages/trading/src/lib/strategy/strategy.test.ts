import { Capital, ExchangeRate } from '../types'
import { createMonthlyOscillationStrategy } from './strategy'

describe('createMonthlyOscillationStrategy', () => {
  const rate: ExchangeRate = {
    buyBYNPrice: 0.5,
    buyUSDPrice: 2,
  }

  it('trades on specified dates', () => {
    const capital: Capital = {
      USD: 100,
      BYN: 100,
    }
    const strategy = createMonthlyOscillationStrategy(capital, {
      buyBYNDate: 1,
      buyUSDDate: 2,
    })
    const timestamp = new Date('01/01/2000').getTime()
    const result = strategy.next(timestamp, rate)

    expect(result).toStrictEqual({
      USD: 0,
      BYN: 150,
    })
  })

  it("doesn't trade on other dates", () => {
    const capital: Capital = {
      USD: 100,
      BYN: 100,
    }
    const strategy = createMonthlyOscillationStrategy(capital, {
      buyBYNDate: 1,
      buyUSDDate: 2,
    })
    const timestamp = new Date('10/06/2000').getTime()
    const result = strategy.next(timestamp, rate)

    expect(result).toStrictEqual(capital)
  })
})
