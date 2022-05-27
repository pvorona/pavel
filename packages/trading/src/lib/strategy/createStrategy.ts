import { assert, assertNever } from '@pavel/assert'
import { ExternalMarker, ExternalSimpleMarker } from '@pavel/chart'
import { getLast, toCanonicalRect } from '@pavel/utils'
import { buyBYN, buyUSD } from '../exchange'
import {
  Capital,
  Decision,
  ExchangeRate,
  Strategy,
  Trade,
  TradeType,
} from '../types'
import { combineMachines } from './combineMachines'
import { createMonthlyOscillationDecisionMachine } from './createMonthlyOscillationDecisionMachine'
import { createStopLossDecisionMachine } from './createStopLossDecisionMachine'

const GOOD_TRADE_FILL = 'rgba(27, 245, 110, 0.2)'
const GOOD_TRADE_STROKE = 'rgba(27, 245, 110, 1)'

const BAD_TRADE_FILL = 'rgba(255, 0, 0, 0.3)'
const BAD_TRADE_STROKE = 'rgba(255, 0, 0, 1)'

export type OscillationStrategyOptions = {
  readonly buyUSDDate: number
  readonly buyBYNDate: number
  readonly maxDrawdown: number
}

export const DEFAULT_OSCILLATION_STRATEGY_OPTIONS: OscillationStrategyOptions =
  {
    buyUSDDate: 20,
    buyBYNDate: 4,
    maxDrawdown: 0.04,
  }

export function createStrategy(
  initialCapital: Capital,
  {
    buyUSDDate,
    buyBYNDate,
    maxDrawdown,
  }: OscillationStrategyOptions = DEFAULT_OSCILLATION_STRATEGY_OPTIONS,
): Strategy {
  assert(buyBYNDate >= 0 && buyBYNDate <= 31)
  assert(buyUSDDate >= 0 && buyUSDDate <= 31)
  assert(buyBYNDate !== buyUSDDate)
  assert(maxDrawdown >= 0 && maxDrawdown <= 1)

  const machine = combineMachines([
    createStopLossDecisionMachine({ maxDrawdown }),
    createMonthlyOscillationDecisionMachine({ buyUSDDate, buyBYNDate }),
  ])
  const transactionValueMarkers: ExternalSimpleMarker[] = []
  const transactionDateMarkers: ExternalSimpleMarker[] = []
  const markers: ExternalMarker[] = [
    {
      type: 'group',
      markers: transactionValueMarkers,
      label: 'Transactions',
      color: '#99ffdf',
    },
    {
      type: 'group',
      markers: transactionDateMarkers,
      label: 'Dates',
      color: '#bd99ff',
    },
  ]
  const history: Trade[] = []
  let capital = initialCapital

  return {
    next: (timestamp: number, rate: ExchangeRate): Capital => {
      const prevTrade = getLast(history)
      const decision = machine.next({
        timestamp,
        rate,
        capital,
        position: prevTrade,
      })

      if (decision === Decision.DO_NOTHING) {
        return capital
      }

      if (decision === Decision.BUY_USD) {
        capital = buyUSD(capital, rate)
        const trade: Trade = {
          timestamp,
          capital,
          type: TradeType.BUY_USD,
          rate,
        }
        history.push(trade)

        transactionDateMarkers.push({
          type: 'x',
          x: trade.timestamp,
          color: 'green',
        })

        if (prevTrade) {
          const x1 = prevTrade.timestamp
          const y1 = prevTrade.rate.buyBYNPrice
          const x2 = trade.timestamp
          const y2 = trade.rate.buyUSDPrice
          const fill = y2 < y1 ? GOOD_TRADE_FILL : BAD_TRADE_FILL
          const stroke = y2 < y1 ? GOOD_TRADE_STROKE : BAD_TRADE_STROKE

          transactionValueMarkers.push({
            type: 'rect',
            fill,
            stroke,
            lineWidth: 1,
            ...toCanonicalRect(x1, y1, x2, y2),
          })
        }

        return capital
      }

      if (decision === Decision.BUY_BYN) {
        capital = buyBYN(capital, rate)
        const trade: Trade = {
          timestamp,
          capital,
          type: TradeType.BUY_BYN,
          rate,
        }
        history.push(trade)

        transactionDateMarkers.push({
          type: 'x',
          x: trade.timestamp,
          color: 'red',
        })

        if (prevTrade) {
          const x1 = prevTrade.timestamp
          const y1 = prevTrade.rate.buyUSDPrice
          const x2 = trade.timestamp
          const y2 = trade.rate.buyBYNPrice
          const fill = y2 > y1 ? GOOD_TRADE_FILL : BAD_TRADE_FILL
          const stroke = y2 > y1 ? GOOD_TRADE_STROKE : BAD_TRADE_STROKE

          transactionValueMarkers.push({
            type: 'rect',
            fill,
            stroke,
            lineWidth: 1,
            ...toCanonicalRect(x1, y1, x2, y2),
          })
        }

        return capital
      }

      assertNever(decision)
    },
    getCapital: () => capital,
    getHistory: () => history,
    getMarkers: () => markers,
  }
}
