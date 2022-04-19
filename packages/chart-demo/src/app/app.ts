import { Chart, ChartOptions } from '@pavel/chart'
import { assert } from '@pavel/assert'
import { theme } from './theme'
import './app.scss'

type DataEntry = { timestamp: number; value: number }

document.body.style.background = theme.body || theme.background

async function startApp() {
  const seriesPromise = fetch('./assets/data/SPX.json').then(r => r.json())

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const series = await seriesPromise
      const chartContainer = document.getElementById('chart')

      assert(chartContainer !== null, 'Cannot find #chart container')

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
          start: new Date(series[0].timestamp).getTime(),
          end: new Date(series[series.length - 1].timestamp).getTime(),
        },
        graphNames: ['A', 'B'],
        domain: series.map(d => new Date(d.timestamp).getTime()),
        data: {
          A: series.map(d => d.bid),
          B: series.map(d => d.ofr),
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
        total: series.length,
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
