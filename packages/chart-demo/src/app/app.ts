import { Chart, ExternalChartOptions } from '@pavel/chart'
import { theme } from './theme'
import './app.scss'
import { assert, isNull } from '@pavel/assert'
// import { processed } from './processed'
// import processed from '/Users/pavelvorona/Projects/pavel/packages/collector/src/assets/0_processed.json'
// import processed from '/Users/pavelvorona/Projects/pavel/packages/collector/src/assets/516_processed.json'
import rawData from '/Users/pavelvorona/Projects/pavel/packages/collector/src/assets/516.json'

document.body.style.background = theme.body || theme.background

async function getData() {
  return rawData
  // const rawData = processed

  // const filteredData = rawData.filter(item => {
  //   return (
  //     'conversion' in item &&
  //     item.conversion !== 0 &&
  //     'base' in item &&
  //     item.base !== 0 &&
  //     'spanA' in item &&
  //     item.spanA !== 0 &&
  //     'spanB' in item &&
  //     item.spanB !== 0 &&
  //     'low' in item &&
  //     item.low !== 0 &&
  //     'high' in item &&
  //     item.high !== 0 &&
  //     'close' in item &&
  //     item.close !== 0 &&
  //     'time' in item &&
  //     item.time !== 0
  //   )
  // })

  // return filteredData as {
  //   conversion: number
  //   base: number
  //   spanA: number
  //   spanB: number
  //   low: number
  //   high: number
  //   close: number
  //   time: number
  // }[]
}

async function startApp() {
  const dataPromise = getData()

  // const series1 = fetch(
  //   './assets/data/dj/1593495762538-1593515829173.json',
  // ).then(r => r.json())
  // const series2 = fetch(
  //   './assets/data/dj/1593520483683-1593533756968.json',
  // ).then(r => r.json())

  document.addEventListener('DOMContentLoaded', async () => {
    // const startIndex = 5000
    // const itemsToShow = 13_908
    // const itemsToShow = 1000

    try {
      const data = await dataPromise

      console.log(`Total items: ${data.length} per series`)

      // const [data1O, data2O] = await Promise.all([series1, series2])
      // const data1: DataEntry[] = data1O.slice(
      //   startIndex,
      //   startIndex + itemsToShow,
      // )
      // const data2: DataEntry[] = data2O.slice(
      //   startIndex,
      //   startIndex + itemsToShow,
      // )
      const chartContainer = document.getElementById('chart')

      assert(!isNull(chartContainer), 'Chart container is not found')

      const options: ExternalChartOptions = {
        graphNames: [
          'ofr',
          'bid',

          // 'low',
          // 'high',
          // 'close',

          // 'conversion',
          // 'base',
          // 'spanA',
          // 'spanB',
        ],
        domain: data.map(item => new Date(item.timestamp).getTime()),
        data: {
          ofr: data.map(item => item.ofr),
          bid: data.map(item => item.bid),
          // conversion: data.map(item => item.conversion),
          // base: data.map(item => item.base),
          // spanA: data.map(item => item.spanA),
          // spanB: data.map(item => item.spanB),
          // low: data.map(item => item.low),
          // high: data.map(item => item.high),
          // close: data.map(item => item.close),
        },
        colors: [
          // ofr: '#78dd9f',
          '#8cdeac',
          // bid: '#f47b7b',
          // bid: '#f56363',
          '#ff7d7d',

          '#43608f',
          '#7b3f30',
          '#43926d',
          '#e36475',
          '#f47b7b',
          '#78dd9f',
        ],
        gradient: {
          conversion: false,
          base: false,
          spanA: false,
          spanB: false,
          low: true,
          high: true,
          close: true,
        },
      }

      Chart(chartContainer, options)
    } catch (error) {
      console.error(error)
    }
  })
}

startApp()
