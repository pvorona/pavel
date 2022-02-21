import {
  Chart,
  ChartOptionsUnvalidated,
  TimeSeriesDataPoint,
} from '@pavel/chart'
import { theme } from './theme'
import './app.scss'

document.body.style.background = theme.body || theme.background

const TIME_STEP = 250
const MAX_VALUE = 10_000
const startTime = 0

let currentIteration = 0

function generateData(items: number): TimeSeriesDataPoint[] {
  const result = []

  for (let i = 0; i < items; i++) {
    result.push({
      timestamp: startTime + i * TIME_STEP + currentIteration * TIME_STEP,
      value: Math.random() * MAX_VALUE,
    })
  }

  currentIteration += items

  return result
}

async function startApp() {
  // const series1 = fetch(
  //   './assets/data/dj/1593495762538-1593515829173.json',
  // ).then(r => r.json())
  // const series2 = fetch(
  //   './assets/data/dj/1593520483683-1593533756968.json',
  // ).then(r => r.json())

  document.addEventListener('DOMContentLoaded', async () => {
    // const fraction = 0.6

    try {
      // const [data1O, data2O] = await Promise.all([series1, series2])
      // const data1: DataEntry[] = data1O.slice(
      //   0,
      //   Math.floor(data1O.length * fraction),
      // )
      // const data2: DataEntry[] = data2O.slice(
      //   0,
      //   Math.floor(data1O.length * fraction),
      // )
      const chartContainer = document.getElementById('chart')

      if (!chartContainer) {
        throw new Error('Cannot find #chart container')
      }

      const data = generateData(10)

      const options: ChartOptionsUnvalidated = {
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
          startIndex: 0,
          endIndex: data.length - 1,
        },
        // graphNames: ['A', 'B'],
        graphNames: ['A'],
        domain: data.map(d => d.timestamp),
        data: {
          A: data.map(d => d.value),
        },
        lineJoin: {
          A: 'bevel',
          B: 'bevel',
        },
        lineCap: {
          A: 'butt',
          B: 'butt',
        },
        // Allow to specify array of colors to cycle through
        colors: { A: theme.series[0], B: theme.series[1] },
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

      const chart = Chart(chartContainer, options)

      setInterval(() => {
        const newData = generateData(1)

        chart.append('A', newData)
      }, TIME_STEP)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
