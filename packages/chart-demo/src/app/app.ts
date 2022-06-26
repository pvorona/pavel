import { Chart, ExternalChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
import { toCanonicalRect } from '@pavel/utils'

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
      const adjustedData1 = data1.map(d => d.value)
      const adjustedData2 = data2.map(d => d.value)

      const options: ExternalChartOptions = {
        graphs: [
          { key: 'A', gradient: true },
          { key: 'B', gradient: true },
        ],
        domain,
        data: {
          A: adjustedData1,
          B: adjustedData2,
        },

        // markers: [
        //   {
        //     type: 'group',
        //     label: 'Prediction',
        //     markers: [
        //       {
        //         type: 'flow',
        //         fill: 'rgba(0, 153, 255, 0.1)',
        //         lines: [
        //           {
        //             key: 'top',
        //             lineWidth: 2,
        //             strokeStyle: '#2d9bf4',
        //           },
        //           {
        //             key: 'bottom',
        //             lineWidth: 2,
        //             strokeStyle: '#2d9bf4',
        //           },
        //         ],
        //         domain,
        //         data: {
        //           top: domain.map(
        //             (_, index) =>
        //               Math.max(adjustedData1[index], adjustedData2[index]) + 10,
        //           ),
        //           bottom: domain.map(
        //             (_, index) =>
        //               Math.min(adjustedData1[index], adjustedData2[index]) - 10,
        //           ),
        //         },
        //       },
        //     ],
        //   },
        // ],

        // gradient: {},

        // markers: [
        //   {
        //     type: 'group',
        //     label: 'Markers',
        //     markers: [
        //       {
        //         type: 'y',
        //         y: data1[185].value,
        //         strokeStyle: '#e94e75',
        //         lineWidth: 2,
        //       },
        //       {
        //         type: 'x',
        //         x: domain[185],
        //         strokeStyle: '#d85c7b',
        //         lineWidth: 2,
        //       },
        //       {
        //         type: 'x',
        //         x: domain[835],
        //         strokeStyle: '#2EB086',
        //         lineWidth: 2,
        //       },
        //       {
        //         type: 'rect',
        //         ...toCanonicalRect(
        //           domain[500],
        //           data1[500].value + 15,
        //           domain[600],
        //           data1[600].value,
        //         ),
        //         fill: 'rgba(23, 213, 153, 0.176)',
        //       },
        //     ],
        // },
        // ],
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
