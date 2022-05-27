import { assert } from '@pavel/assert'
import { getDateOfMonth } from '@pavel/utils'
import { buyBYN, buyUSD } from '../exchange'
import { Capital, ExchangeRate, Strategy, Trade } from '../types'

export function createMonthlyOscillationStrategy(
  initialCapital: Capital,
  {
    buyUSDDate,
    buyBYNDate,
  }: {
    readonly buyUSDDate: number
    readonly buyBYNDate: number
  } = {
    buyUSDDate: 20,
    buyBYNDate: 4,
  },
): Strategy {
  assert(buyBYNDate >= 0 && buyBYNDate <= 31)
  assert(buyUSDDate >= 0 && buyUSDDate <= 31)
  assert(buyBYNDate !== buyUSDDate)

  const history: Trade[] = []
  let capital = initialCapital

  return {
    next: (timestamp: number, rate: ExchangeRate): Capital => {
      const date = getDateOfMonth(timestamp)

      // TODO
      // - Stop loss

      if (date === buyBYNDate) {
        capital = buyBYN(capital, rate)
        history.push({ timestamp, capital, type: 'BUY_BYN', rate })

        return capital
      }

      if (date === buyUSDDate) {
        capital = buyUSD(capital, rate)
        history.push({ timestamp, capital, type: 'BUY_USD', rate })

        return capital
      }

      return capital
    },
    getCapital: () => capital,
    getHistory: () => history,
  }
}
