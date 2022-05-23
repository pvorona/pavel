import { Chart, ExternalChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
import spx from '../assets/data/SPX.json'

document.body.style.background = theme.body || theme.background

async function startApp() {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const chartContainer = document.getElementById('chart')

      assert(!isNull(chartContainer), 'Chart container is not found')

      const options: ExternalChartOptions = {
        domain: 'timestamp',
        graphs: [{ key: 'ofr', label: 'Offer' }, 'bid'],
        data: (spx as any).map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).getTime(),
        })),
        // domain: data1.map(d => d.timestamp),
        // data: {
        //   A: data1.map(d => d.value),
        //   B: data2.map(d => d.value),
        // },
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
