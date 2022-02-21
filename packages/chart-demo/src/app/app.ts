import { Chart, ChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'

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
    const fraction = 0.6

    try {
      const [data1O, data2O] = await Promise.all([series1, series2])
      const data1: DataEntry[] = data1O.slice(
        0,
        Math.floor(data1O.length * fraction),
      )
      const data2: DataEntry[] = data2O.slice(
        0,
        Math.floor(data1O.length * fraction),
      )
      const chartContainer = document.getElementById('chart')

      if (!chartContainer) {
        throw new Error('Cannot find #chart container')
      }

      const options: ChartOptions = {
        x: {
          color: theme.x,
          marginBottom: 7,
          marginTop: 10,
          ticks: 8,
          tick: {
            height: 0,
            margin: 0,
          },
          label: {
            fontSize: 12,
            fontFamily: 'system-ui, sans-serif',
          },
        },
        y: {
          color: theme.y,
          ticks: 6,
          label: {
            color: theme.yLabel,
            fontSize: 12,
            fontFamily: 'system-ui, sans-serif',
            marginBottom: 7,
            marginLeft: 10,
          },
        },
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        lineWidth: theme.lineWidth || 1,
        overview: {
          height: 100,
          lineWidth: theme.overviewLineWidth || 1,
          overlayColor: theme.overviewBackdrop,
          edgeColor: theme.overviewEdge,
        },
        viewBox: {
          startIndex: (data1.length - 1) * 0.75,
          endIndex: data1.length - 1,
        },
        graphNames: ['A', 'B'],
        domain: data1.map(d => d.timestamp),
        data: {
          A: data1.map(d => d.value),
          B: data2.map(d => d.value),
        },
        lineJoin: {
          A: 'bevel',
          B: 'bevel',
        },
        lineCap: {
          A: 'butt',
          B: 'butt',
        },
        colors: { A: theme.series[0], B: theme.series[1] },
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
