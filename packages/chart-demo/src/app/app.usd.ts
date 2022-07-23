import { Chart, ChartOptions, DatePart } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
import { data } from './usd.myfin'
import { getSimpleMovingAverage, sqrt } from '@pavel/utils'
import { newArrayOfZeros, transform } from './fft'

document.body.style.background = theme.body || theme.background

async function startApp() {
  document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart')

    assert(!isNull(chartContainer), 'Chart container is not found')

    // 1662,1140
    const Window = {
      Start: 1140,
      End: 1662,
      get size() {
        return this.Start - this.End
      },
    }

    const domain = data
      .map(item => item.timestamp)
      .slice(Window.Start, Window.End)
    const buy = data.map(item => item.buy)
    const sma = getSimpleMovingAverage(buy, 5)
    const diff = buy.map((buyPrice, index) => buyPrice - sma[index])

    const fftReal = diff.slice(Window.Start, Window.End)
    const fftImag = newArrayOfZeros(fftReal.length)
    transform(fftReal, fftImag)
    const fftNorm = fftReal.map((real, index) =>
      sqrt(real ** 2 + fftImag[index] ** 2),
    )

    const options: ChartOptions = {
      graphs: [
        // { label: 'Spectrum Real', key: 'fftReal' },
        // { label: 'Spectrum Imag', key: 'fftImag' },
        { label: 'Spectrum', key: 'fftNorm' },
        { label: 'Signal', key: 'diff' },
        // { lineWidth: 2, label: 'Sell', key: 'sell' },
        // { lineWidth: 2, label: 'SMA', key: 'sma' },
        // { lineWidth: 2, label: 'Buy - SMA Buy 30', key: 'diff' },
        { lineWidth: 2, label: 'Sine', key: 'sine' },
        // { lineWidth: 2, label: 'Model', key: 'model' },
      ],
      domain,
      data: {
        diff: diff.slice(Window.Start, Window.End),
        buy: buy.slice(Window.Start, Window.End),
        fftReal,
        fftImag,
        fftNorm,
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
    }

    Chart(chartContainer, options)
  })
}

startApp()
