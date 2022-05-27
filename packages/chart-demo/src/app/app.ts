import {
  Chart,
  ExternalChartOptions,
  ExternalMarker,
  ExternalRectMarker,
  ExternalSimpleMarker,
} from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
import { data as nbdata } from './usd'
import { data } from './usd.myfin'
import { toCanonicalRect } from '@pavel/utils'
import { strategy } from './trade'

console.log(strategy.getCapital())

document.body.style.background = theme.body || theme.background

async function startApp() {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const chartContainer = document.getElementById('chart')

      assert(!isNull(chartContainer), 'Chart container is not found')

      // const domain = createTimestamps(
      //   new Date('01/01/2015').getTime(),
      //   24 * 60 * 60 * 1000,
      //   data.length,
      // )

      const domain = data.map(item => new Date(item.date).getTime())

      const history = strategy.getHistory()
      const xMarkers: ExternalMarker[] = history.map(trade => ({
        type: 'x' as const,
        x: trade.timestamp,
        color:
          trade.type === 'BUY_USD' ? 'hsl(161, 79%, 38%)' : 'hsl(42, 67%, 50%)',
        lineWidth: trade.type === 'BUY_USD' ? (2 as const) : (2 as const),
      }))

      const GOOD_TRADE_COLOR = 'rgba(94, 207, 158, 0.15)'
      const BAD_TRADE_COLOR = 'rgba(207, 94, 94, 0.15)'
      // const GOOD_TRADE_COLOR = '#5ecf9e'
      // const BAD_TRADE_COLOR = '#cf5e5e'

      const rectMarkers: readonly ExternalSimpleMarker[] = (() => {
        const result = []

        for (let i = 1; i < history.length; i++) {
          const prevTrade = history[i - 1]
          const trade = history[i]

          const color = (() => {
            if (prevTrade.type === 'BUY_BYN' && trade.type === 'BUY_USD') {
              const y1 = prevTrade.rate.buyBYNPrice
              const y2 = trade.rate.buyUSDPrice
              const fill = y2 < y1 ? GOOD_TRADE_COLOR : BAD_TRADE_COLOR
              return { y1, y2, fill }
            }

            if (prevTrade.type === 'BUY_USD' && trade.type === 'BUY_BYN') {
              const y1 = prevTrade.rate.buyUSDPrice
              const y2 = trade.rate.buyBYNPrice
              const fill = y2 > y1 ? GOOD_TRADE_COLOR : BAD_TRADE_COLOR
              return { y1, y2, fill }
            }
          })()

          const rect: ExternalRectMarker = {
            type: 'rect',
            fill: color.fill,
            ...toCanonicalRect(
              trade.timestamp,
              color.y1,
              prevTrade.timestamp,
              color.y2,
            ),
          }
          result.push(rect)
        }

        return result
      })()

      const markers: ExternalMarker[] = [
        // ...xMarkers,
        {
          type: 'group' as const,
          markers: rectMarkers,
          label: 'Transactions',
          color: '#99ffdf',
        },
      ]

      const options: ExternalChartOptions = {
        graphs: [
          { key: 'sell', label: 'Buy' },
          { key: 'buy', label: 'Sell' },
          { key: 'nb', label: 'NB' },
        ],
        domain,
        data: {
          buy: data.map(item => item.buy),
          sell: data.map(item => item.sell),
          nb: nbdata,
          // USD: averageAdjustedPrice,
        },
        gradient: {},
        markers,
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

function createTimestamps(
  startTime: number,
  increment: number,
  items: number,
): number[] {
  const result = new Array(items)

  for (let i = 0; i < items; i++) {
    result[i] = startTime + i * increment
  }

  return result
}

startApp()
