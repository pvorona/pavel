import { Capital, Exchange, ExchangeRate } from '../types'

export function createExchange(): Exchange {
  return {
    buyUSD: (capital: Capital, rate: ExchangeRate): Capital => {
      if (capital.BYN === 0) {
        throw new Error('Insufficient funds')
      }

      return {
        BYN: 0,
        USD: capital.USD + capital.BYN / rate.buyUSDPrice,
      }
    },

    buyBYN: (capital: Capital, rate: ExchangeRate): Capital => {
      if (capital.USD === 0) {
        throw new Error('Insufficient funds')
      }

      return {
        BYN: capital.BYN + capital.USD * rate.buyBYNPrice,
        USD: 0,
      }
    },
  }
}

export const { buyBYN, buyUSD } = createExchange()
