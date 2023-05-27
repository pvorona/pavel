import { assert, ensureDefined, ensureNever } from '@pavel/assert'
import { getOrInitMap, getRandomArrayElement } from '@pavel/utils'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import {
  ClientEvent,
  ClientEventType,
  GameEndReason,
  Game,
  Field,
  Side,
  User,
  createGameEndedEvent,
  createGameStartedEvent,
  encodeServerMessage,
  getUserSide,
  GAME_ID_SEARCH_PARAM,
  SERVER_PONG_EVENT,
  decodeClientMessage,
  SERVER_PING_EVENT,
  AppendEvent,
  FieldSize,
  createAppendedEvent,
  MAX_MOVE_COUNT,
  CellValue,
  Board,
  MoveResult,
} from '@pavel/bubbler-core'

// User1 opens app
// User1 clicks [New game] button
// Game created in DB
// User1 redirected to game page
// User1 connects to WSS
// Waiting opponent screen is shown

// User2 opens the app
// User2 clicks [Join game] button
// User2 redirected to game page
// User2 connects to WSS

// WSS sends "Game Started" event to both users

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

const webSocketServer = new WebSocketServer({ port, host })

const clientsByGameId = new Map<string, WebSocket[]>()
// const gameById = new Map<string, Game>()
// TODO: username update
const userIdByClient = new Map<WebSocket, string>()

const boardByGameId = new Map<string, Board>()

const lastInteractionTimestampByWebSocket = new Map<WebSocket, number>()

const DROP_CONNECTION_TIMEOUT = 30_000
const CHECK_DROPPED_CONNECTION_INTERVAL = 1000
const PING_INTERVAL = 5000

startPingingInactiveClients()
startClosingInactiveClients()

webSocketServer.on('connection', (ws, request) => {
  // TODO: Auth
  const userId: string
  const searchParams = new URLSearchParams(request.url.slice(2))

  if (!searchParams.has(GAME_ID_SEARCH_PARAM)) {
    console.error(`Received request without game id param: ${request.url}`)

    ws.close(1008)
  }

  userIdByClient.set(ws, userId)
  lastInteractionTimestampByWebSocket.set(ws, Date.now())

  const gameId = searchParams.get(GAME_ID_SEARCH_PARAM)
  const clients = getOrInitMap(clientsByGameId, gameId, [])
  const game: Game

  clients.push(ws)

  if (clients.length === 2) {
    const userIds = clients.map(client => userIdByClient.get(client))
    const currentUserId = getRandomArrayElement(userIds)

    boardByGameId.set(game.id, new Board(userIds, currentUserId))

    for (const client of clients) {
      // TODO: Client to side mapping
      const event = createGameStartedEvent({ side, opponentName })
      const response = encodeServerMessage(event)
      client.send(response)
    }
  }

  ws.on('close', (code, reason) => {
    for (const client of clients) {
      // TODO: Client to side mapping
      const side = Side.Left
      const event = createGameEndedEvent(
        side === Side.Left
          ? GameEndReason.LeftPlayerLeft
          : GameEndReason.RightPlayerLeft,
      )
      const response = encodeServerMessage(event)
      client.send(response)
    }

    boardByGameId.delete(game.id)
    clients.length = 0
  })

  ws.on('message', data => {
    lastInteractionTimestampByWebSocket.set(ws, Date.now())

    const incomingMessage = decodeClientMessage(data)

    if (incomingMessage.type === ClientEventType.Ping) {
      const response = encodeServerMessage(SERVER_PONG_EVENT)
      ws.send(response)

      return
    }

    if (incomingMessage.type === ClientEventType.Pong) {
      return
    }

    if (incomingMessage.type === ClientEventType.Surrender) {
      const side = getUserSide(userId, game)
      const reason =
        side === Side.Left
          ? GameEndReason.LeftPlayerSurrendered
          : GameEndReason.RightPlayerSurrendered
      const event = createGameEndedEvent(reason)
      const response = encodeServerMessage(event)
      for (const client of clients) {
        client.send(response)
        client.close()
      }

      clientsByGameId.delete(game.id)
      boardByGameId.delete(game.id)

      return
    }

    if (incomingMessage.type === ClientEventType.Append) {
      const board = ensureDefined(boardByGameId.get(game.id))

      // Verify player turn
      if (board.currentSide !== incomingMessage)
        const result = board.move(incomingMessage.payload.rowIndex)

      if (result === MoveResult.Unchanged) {
        return
      }

      if (result === MoveResult.Moved) {
        const event = createAppendedEvent(incomingMessage.payload)
        const response = encodeServerMessage(event)

        for (const client of clients) {
          client.send(response)
        }

        return
      }

      if (result === MoveResult.Draw) {
        const event = createDrawEvent()
        const response = encodeServerMessage(event)

        for (const client of clients) {
          client.send(response)
        }

        return
      }

      if (result === MoveResult.Won) {
        const event = createWonEvent()
        const response = encodeServerMessage(event)

        for (const client of clients) {
          client.send(response)
        }

        return
      }

      ensureNever(result)
    }

    ensureNever(incomingMessage, `Received unknown message ${incomingMessage}`)
  })

  ws.on('error', e => {
    console.error(e)
  })
})

function startPingingInactiveClients() {
  return setInterval(() => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByWebSocket) {
      if (now - timestamp > PING_INTERVAL) {
        const response = encodeServerMessage(SERVER_PING_EVENT)
        client.send(response)
      }
    }
  }, PING_INTERVAL)
}

function startClosingInactiveClients() {
  return setInterval(() => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByWebSocket) {
      if (now - timestamp > DROP_CONNECTION_TIMEOUT) {
        client.close()
        lastInteractionTimestampByWebSocket.delete(client)
        // TODO: Finish game and notify remaining client
      }
    }
  }, CHECK_DROPPED_CONNECTION_INTERVAL)
}
