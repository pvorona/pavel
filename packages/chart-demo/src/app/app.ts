import { Chart, ExternalChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'

type DataEntry = { timestamp: number; value: number }

document.body.style.background = theme.body || theme.background

async function startApp() {
  const series1 = fetch(
    './assets/data/dj/1593495762538-1593515829173.json',
  ).then(r => r.json())
  const series2 = fetch(
    './assets/data/dj/1593520483683-1593533756968.json',
  ).then(r => r.json())

  document.addEventListener('DOMContentLoaded', async () => {
    const startIndex = 5000
    // const itemsToShow = 13_908
    const itemsToShow = 1000

    try {
      const [data1O, data2O] = await Promise.all([series1, series2])
      const data1: DataEntry[] = data1O.slice(
        startIndex,
        startIndex + itemsToShow,
      )
      const data2: DataEntry[] = data2O.slice(
        startIndex,
        startIndex + itemsToShow,
      )
      const chartContainer = document.getElementById('chart')

      assert(!isNull(chartContainer), 'Chart container is not found')

      const domain = data1.map(d => d.timestamp)

      const options: ExternalChartOptions = {
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        viewBox: {
          start: domain[0],
          end: domain[domain.length - 1],
        },
        graphNames: ['A', 'B'],
        domain,
        data: {
          A: data1.map(d => d.value),
          B: data2.map(d => d.value),
        },
        total: data1.length,
        visibility: {
          A: true,
          B: true,
        },
        tooltip: {
          lineColor: theme.tooltipLine,
          backgroundColor: theme.tooltipBackgroundColor,
          color: theme.tooltipColor,
        },
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
