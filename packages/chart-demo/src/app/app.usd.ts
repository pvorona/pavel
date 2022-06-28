import { Chart, ChartOptions, DatePart } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
import { data } from './usd.myfin'
import { strategy } from './trade'
import {
  getNumberOfDaysInMonth,
  getSimpleMovingAverage,
  interpolate,
  PI,
  sin,
} from '@pavel/utils'

console.log(strategy.getCapital())
console.log(strategy.getHistory().map(i => i.capital))

// document.body.style.background = theme.body || theme.background

async function startApp() {
  document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart')

    assert(!isNull(chartContainer), 'Chart container is not found')

    const domain = data.map(item => item.timestamp)
    const buy = data.map(item => item.buy)
    const sell = data.map(item => item.sell)
    const sma = getSimpleMovingAverage(buy, 5)
    const diff = buy.map((buyPrice, index) => buyPrice - sma[index])
    const sine = domain.map(timestamp => {
      const date = new Date(timestamp)
      const day = date.getDate()
      const month = date.getMonth()
      const year = date.getFullYear()

      // ;(PI * 3) / 2 - PI / 2
      // 20 - 4

      // PI / 2 - (PI * 3) / 2
      // 4 - 20

      // 20, 21, 22, ... 31, 1, 2, 3, 4

      const phase = (() => {
        if (day >= 4 && day <= 20) {
          return interpolate(4, 20, PI / 2, (PI * 3) / 2, day)
        }

        const { period, progress } = (() => {
          if (day < 4) {
            const numberOfDaysInPrevMonth =
              month === 0
                ? getNumberOfDaysInMonth(11, year - 1)
                : getNumberOfDaysInMonth(month - 1, year)
            return {
              period: 3 + numberOfDaysInPrevMonth - 21,
              progress: day + numberOfDaysInPrevMonth - 21,
            }
          }

          const numberOfDaysInCurrentMonth = getNumberOfDaysInMonth(month, year)
          return {
            period: 3 + numberOfDaysInCurrentMonth - 21,
            progress: day - 21,
          }
        })()

        return interpolate(0, period, (PI * 3) / 2, (PI * 5) / 2, progress)
      })()

      return sin(phase)
    })
    const model = sine.map(
      (item, index) => (item * buy[index]) / 64 + sma[index],
    )

    const options: ChartOptions = {
      graphs: [
        { lineWidth: 2, label: 'Buy', key: 'buy' },
        { lineWidth: 2, label: 'Sell', key: 'sell' },
        // { lineWidth: 2, label: 'SMA', key: 'sma' },
        // { lineWidth: 2, label: 'Buy - SMA Buy 30', key: 'diff' },
        // { lineWidth: 2, label: 'Sine', key: 'sine' },
        { lineWidth: 2, label: 'Model', key: 'model' },
      ],
      domain,
      data: {
        buy,
        sell,
        sma,
        diff,
        sine,
        model,
      },
      tooltip: {
        format: [
          DatePart.Date,
          ' ',
          DatePart.MonthFullWord,
          ' ',
          DatePart.Year2Digits,
        ],
      },
      markers: strategy.getMarkers(),
    }

    Chart(chartContainer, options)
  })
}

startApp()
