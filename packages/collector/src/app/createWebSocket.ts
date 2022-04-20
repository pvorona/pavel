import { CURRENCY_WS_API_URL } from '../config'
import { WebSocket, RawData } from 'ws'

const KEEP_ALIVE_INTERVAL_MS = 10_000
const PONG_WAITING_TIME_MS = 10_000

let socketId = 0

type IdentifiableWebSocket = WebSocket & { id: number }

export function createWebSocket({
  onOpen,
  onClose,
  onError,
  onMessage,
}: {
  onOpen: (this: IdentifiableWebSocket) => void
  onClose: (this: IdentifiableWebSocket) => void
  onError: (this: IdentifiableWebSocket, error: Error) => void
  onMessage: (this: IdentifiableWebSocket, data: RawData) => void
}) {
  const id = socketId++
  const ws = new WebSocket(CURRENCY_WS_API_URL)
  const identifiableWs = { ...ws, id }

  let pingTimeoutId: NodeJS.Timeout | undefined = undefined
  let closingWebSocketTimeoutId: NodeJS.Timeout | undefined = undefined

  async function restartTimer() {
    clearTimeout(pingTimeoutId)
    clearTimeout(closingWebSocketTimeoutId)

    pingTimeoutId = setTimeout(onInactivityTimeout, KEEP_ALIVE_INTERVAL_MS)
  }

  ws.on('ping', () => {
    console.log(`[${new Date()}][${id}] Received ping event. Responding.`)
    restartTimer()
    ws.pong()
  })

  ws.on('pong', () => {
    console.log(`[${new Date()}][${id}] Received pong event`)
    restartTimer()
  })

  ws.on('error', error => {
    console.error(`[${new Date()}][${id}] WebSocket error occurred`)
    console.error(error)
    onError.call(identifiableWs, error)
  })

  ws.on('close', () => {
    clearTimeout(pingTimeoutId)
    clearTimeout(closingWebSocketTimeoutId)

    console.log(`[${new Date()}][${id}] WebSocket terminated`)

    onClose.call(identifiableWs)
  })

  ws.on('open', () => {
    console.log(`[${new Date()}][${id}] WebSocket connected`)

    restartTimer()

    onOpen.call(ws)

    ws.on('message', data => {
      restartTimer()

      onMessage.call(identifiableWs, data)
    })
  })

  function onInactivityTimeout() {
    console.warn(
      `[${new Date()}][${id}] Did not receive any messages for more than ${
        KEEP_ALIVE_INTERVAL_MS / 1_000
      } seconds. Trying to ping the server.`,
    )
    ws.ping()

    closingWebSocketTimeoutId = setTimeout(onPingTimeout, PONG_WAITING_TIME_MS)
  }

  function onPingTimeout() {
    console.warn(
      `[${new Date()}][${id}] Did not receive pong for ${
        PONG_WAITING_TIME_MS / 1_000
      } seconds. Terminating WebSocket.`,
    )
    ws.terminate()
  }
}
