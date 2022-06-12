import { Chart, ExternalChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'

type DataEntry = { timestamp: number; value: number }

// document.body.style.background = theme.body || theme.background

async function startApp() {
  const series1 = fetch(
    './assets/data/dj/1593442797964-1593443061303.json',
  ).then(r => r.json())

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const [data1O] = await Promise.all([series1])
      const data1: DataEntry[] = data1O
      const chartContainer = document.getElementById('chart')

      assert(!isNull(chartContainer), 'Chart container is not found')

      const domain = data1.map(d => d.timestamp)
      const adjustedData1 = data1.map(d => d.value)

      const options: ExternalChartOptions = {
        graphs: ['A'],
        domain,
        data: {
          A: adjustedData1,
        },

        lineWidth: 2,

        gradient: {},

        markers: [
          {
            type: 'group',
            label: 'Prediction',
            color: '#2d9bf4',
            markers: [
              {
                type: 'flow',
                fill: 'rgba(0, 153, 255, 0.1)',
                lines: [
                  {
                    key: 'top',
                    lineWidth: 1,
                    strokeStyle: '#2d9bf4',
                  },
                  {
                    key: 'bottom',
                    lineWidth: 2,
                    strokeStyle: '#2d9bf4',
                  },
                ],
                domain,
                data: {
                  top: domain.map(
                    (_, index) => adjustedData1[index] + 10 + 5 * Math.random(),
                  ),
                  bottom: domain.map(
                    (_, index) => adjustedData1[index] - 10 + 5 * Math.random(),
                  ),
                },
              },
            ],
          },
        ],
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
