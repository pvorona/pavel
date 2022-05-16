import { readFile, writeFile } from 'fs/promises'
import { createIchimoku } from './Ichimoku'
import { Candle } from './types'

type DataEntry = {
  timestamp: string
  ofr: number
  ofrQty: number
  _id: string
  bidQty: number
  bid: number
}

const DATA_PATH =
  '/Users/pavelvorona/Projects/pavel/packages/collector/src/assets/data.json'

const DATA_DIR =
  '/Users/pavelvorona/Projects/pavel/packages/collector/src/assets'

async function getData(): Promise<DataEntry[]> {
  return JSON.parse(await readFile(DATA_PATH, { encoding: 'utf8' }))
}

// Split data into continuous sequences

const MAX_TIME_GAP_MS = 5_000

export async function prepareSequences() {
  const data = await getData()

  console.log(`${data.length} items loaded`)

  const sequences: DataEntry[][] = []
  let currentSequence: DataEntry[] = []

  for (let i = 1; i < data.length; i++) {
    const timeDiff =
      new Date(data[i].timestamp).getTime() -
      new Date(data[i - 1].timestamp).getTime()

    if (timeDiff > MAX_TIME_GAP_MS) {
      sequences.push(currentSequence)
      currentSequence = []
    }

    currentSequence.push(data[i])
  }

  sequences.push(currentSequence)

  console.log(
    `Received ${sequences.length} sequences. Max length: ${Math.max(
      ...sequences.map(s => s.length),
    )}`,
  )

  for (let i = 0; i < sequences.length; i++) {
    const sequence = sequences[i]
    const content = JSON.stringify(sequence)
    const path = `${DATA_DIR}/${i}.json`

    writeFile(path, content)
      .then(() => {
        console.log(`Successfully written ${i}.json`)
      })
      .catch(() => {
        console.error(`Failed to write ${i}.json`)
      })
  }
}

const TOTAL_SEQUENCES = 516

export async function startAnalyzer() {
  for (let i = 0; i <= TOTAL_SEQUENCES; i++) {
  // for (let i = 0; i <= 0; i++) {
    const path = `${DATA_DIR}/${i}.json`
    const content = await readFile(path, { encoding: 'utf8' })
    const data: DataEntry[] = JSON.parse(content)

    console.log(`Starting sequence with ${data.length} items`)

    const candles = tickToCandles({ ticks: data })

    console.log(
      `Generated ${candles.length} candles: ${JSON.stringify(
        candles.slice(0, 5),
      )}
      ...`,
    )

    const ichimoku = createIchimoku()

    const result = []

    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i]
      const value = ichimoku.nextValue(candle)

      result.push({
        ...value,
        ...candle,
      })
    }

    await writeFile(
      `${DATA_DIR}/${i}_processed.json`,
      JSON.stringify(result, null, 2),
    )

    // for (let i = 0; i < candles.length - 5; i++) {
    //   ichimoku.nextValue(candles[i])
    // }

    // for (let i = 5; i >= 1; i--) {
    //   const value = ichimoku.nextValue(candles[candles.length - i])
    //   console.log(`Next ichimoku value: ${JSON.stringify(value)}`)
    // }
  }
}

const CANDLE_SPAN_MS = 1_000

function getTime(time: string): number {
  return new Date(time).getTime()
}

function tickToCandles({
  ticks,
}: {
  ticks: DataEntry[]
}): (Candle & { time: number })[] {
  if (ticks.length === 0) {
    return []
  }

  const candles: (Candle & { time: number })[] = []

  const { timestamp, ofr } = ticks[0]
  let startTime = getTime(timestamp)
  let low = ofr
  let high = ofr
  let hasPendingCandle = false

  for (let i = 1; i < ticks.length; i++) {
    const { timestamp, ofr } = ticks[i]
    const currentTime = getTime(timestamp)

    if (currentTime - startTime <= CANDLE_SPAN_MS) {
      hasPendingCandle = true
      low = Math.min(low, ofr)
      high = Math.max(high, ofr)

      continue
    }

    hasPendingCandle = false

    candles.push({
      low,
      high,
      close: ticks[i - 1].ofr,
      time: startTime,
    })

    startTime = currentTime
    low = ofr
    high = ofr
  }

  if (hasPendingCandle) {
    candles.push({
      low,
      high,
      close: ticks[ticks.length - 1].ofr,
      time: startTime,
    })
  }

  return candles
}
