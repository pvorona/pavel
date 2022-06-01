import { Capital, createStrategy, ExchangeRate } from '@pavel/trading'
import { data } from './usd.myfin'

const initialCapital: Capital = {
  USD: 100,
  BYN: 0,
}

export const strategy = createStrategy(initialCapital)

for (let i = 0; i < data.length; i++) {
  const rate: ExchangeRate = {
    buyBYNPrice: data[i].buy,
    buyUSDPrice: data[i].sell,
  }
  const timestamp = new Date(data[i].date).getTime()

  strategy.next(timestamp, rate)
}
