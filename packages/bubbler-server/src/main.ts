import { ensureDefined, ensureNever } from '@pavel/assert'
import { getOrInitMap, getRandomArrayElement } from '@pavel/utils'
import { WebSocket, WebSocketServer } from 'ws'
import {
  ClientEventType,
  createGameStartedEvent,
  encodeServerMessage,
  GAME_ID_SEARCH_PARAM,
  SERVER_PONG_EVENT,
  decodeClientMessage,
  SERVER_PING_EVENT,
  createPieceAddedEvent,
  Board,
  PlayResult,
  createDrawEvent,
  createWonEvent,
  createOpponentLeftEvent,
  createLostEvent,
  createOpponentSurrenderedEvent,
  createOpponentDisconnectedEvent,
} from '@pavel/bubbler-core'
import {
  PING_INTERVAL,
  DROP_CONNECTION_TIMEOUT,
  CHECK_DROPPED_CONNECTION_INTERVAL,
} from './constants'
import { db } from './db'
import { GameStatus } from '@prisma/client'
import express from 'express'

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

const app = express()

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to ${options.name}!' })
})

const server = app.listen(port, () => {
  console.log(`Listening at http://${host}:${port}`)
})

server.on('error', console.error)

const webSocketServer = new WebSocketServer({ server })

const clientsByGameId = new Map<string, WebSocket[]>()
const gameIdByClient = new Map<WebSocket, string>()
const userIdByClient = new Map<WebSocket, string>()
const boardByGameId = new Map<string, Board>()
const lastInteractionTimestampByClient = new Map<WebSocket, number>()

startPingingInactiveClients()
startClosingInactiveClients()

// TODO: socket readyState

webSocketServer.on('connection', async (client, request) => {
  // TODO: Auth
  // const userId: string
  const userId = 'a'
  const searchParams = new URLSearchParams(request.url.slice(2))

  if (!searchParams.has(GAME_ID_SEARCH_PARAM)) {
    console.error(
      `Received request without "${GAME_ID_SEARCH_PARAM}" param: ${request.url}`,
    )

    return client.close(1008)
  }

  const gameId = searchParams.get(GAME_ID_SEARCH_PARAM)
  const game = await db.game.findFirst({ where: { id: gameId } })

  if (!game || game.status !== GameStatus.WAITING_FOR_OPPONENT) {
    console.error(
      `Game ${gameId} is not accepting new players. User ${userId} tried to connect`,
    )

    return client.close(1008)
  }

  userIdByClient.set(client, userId)
  lastInteractionTimestampByClient.set(client, Date.now())
  gameIdByClient.set(client, gameId)

  const clients = getOrInitMap(clientsByGameId, gameId, [])

  clients.push(client)

  if (clients.length === 2) {
    // TODO: Race conditions
    await db.game.update({
      where: { id: gameId },
      data: { status: GameStatus.IN_PROGRESS },
    })

    const userIds = clients.map(client =>
      ensureDefined(userIdByClient.get(client)),
    )
    const startingUserId = getRandomArrayElement(userIds)
    const board = new Board(userIds, startingUserId)

    boardByGameId.set(game.id, board)

    // TODO: WS readyState
    for (const client of clients) {
      const userId = ensureDefined(userIdByClient.get(client))
      const pendingMove = startingUserId === userId
      const event = createGameStartedEvent({ pendingMove })
      const response = encodeServerMessage(event)
      client.send(response)
    }
  }

  client.on('close', () => {
    for (const innerClient of clients) {
      if (innerClient !== client) {
        const event = createOpponentLeftEvent()
        const response = encodeServerMessage(event)
        innerClient.send(response)
        // TODO: Closing active client? Check interaction protocol.
        innerClient.close()
      }

      cleanUpClient(innerClient)
    }

    cleanUpGame(gameId)
  })

  client.on('message', async data => {
    lastInteractionTimestampByClient.set(client, Date.now())

    const clientEvent = decodeClientMessage(data)

    if (clientEvent.type === ClientEventType.Ping) {
      const response = encodeServerMessage(SERVER_PONG_EVENT)
      client.send(response)

      return
    }

    if (clientEvent.type === ClientEventType.Pong) {
      return
    }

    if (clientEvent.type === ClientEventType.Surrender) {
      for (const innerClient of clients) {
        const events =
          innerClient === client
            ? createLostEvent()
            : [createOpponentSurrenderedEvent(), createWonEvent()]
        const response = encodeServerMessage(events)
        innerClient.send(response)
        innerClient.close()

        cleanUpClient(innerClient)
      }

      cleanUpGame(gameId)

      return
    }

    if (clientEvent.type === ClientEventType.Play) {
      const board = ensureDefined(boardByGameId.get(game.id))

      if (board.getCurrentUserId() !== userId) {
        return
      }

      const {
        payload: { rowIndex, side },
      } = clientEvent
      const result = board.play(rowIndex, side)

      if (result === PlayResult.Unchanged) {
        return
      }

      if (result === PlayResult.PieceAdded) {
        const event = createPieceAddedEvent(clientEvent.payload)
        const response = encodeServerMessage(event)

        for (const client of clients) {
          client.send(response)
        }

        return
      }

      if (result === PlayResult.Draw) {
        const events = [
          createPieceAddedEvent(clientEvent.payload),
          createDrawEvent(clientEvent.payload),
        ]
        const response = encodeServerMessage(events)

        for (const client of clients) {
          client.send(response)
          client.close()
          cleanUpClient(client)
        }

        cleanUpGame(game.id)

        await db.game.update({
          where: { id: gameId },
          data: {
            status: GameStatus.ENDED,
          },
        })

        return
      }

      if (result === PlayResult.Won) {
        for (const innerClient of clients) {
          const events =
            innerClient === client
              ? [createPieceAddedEvent(clientEvent.payload), createWonEvent()]
              : [createPieceAddedEvent(clientEvent.payload), createLostEvent()]
          const response = encodeServerMessage(events)

          innerClient.send(response)
          innerClient.close()
          cleanUpClient(innerClient)
        }

        cleanUpGame(gameId)

        await db.game.update({
          where: { id: gameId },
          data: {
            status: GameStatus.ENDED,
          },
        })

        return
      }

      ensureNever(result)
    }

    ensureNever(clientEvent, `Received unknown message ${clientEvent}`)
  })

  client.on('error', console.error)
})

function startPingingInactiveClients() {
  return setInterval(() => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByClient) {
      if (now - timestamp > PING_INTERVAL) {
        const response = encodeServerMessage(SERVER_PING_EVENT)
        client.send(response)
      }
    }
  }, PING_INTERVAL)
}

function startClosingInactiveClients() {
  return setInterval(async () => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByClient) {
      if (now - timestamp > DROP_CONNECTION_TIMEOUT) {
        const gameId = ensureDefined(gameIdByClient.get(client))
        const clients = ensureDefined(clientsByGameId.get(gameId))
        const event = createOpponentDisconnectedEvent()
        const message = encodeServerMessage(event)

        for (const innerClient of clients) {
          if (innerClient === client) {
            innerClient.terminate()
            cleanUpClient(innerClient)

            continue
          }

          innerClient.send(message)
          innerClient.close()

          cleanUpClient(innerClient)
        }

        cleanUpGame(gameId)

        await db.game.update({
          where: { id: gameId },
          data: { status: GameStatus.ENDED },
        })
      }
    }
  }, CHECK_DROPPED_CONNECTION_INTERVAL)
}

function cleanUpGame(gameId: string) {
  clientsByGameId.delete(gameId)
  boardByGameId.delete(gameId)
}

function cleanUpClient(client: WebSocket) {
  userIdByClient.delete(client)
  lastInteractionTimestampByClient.delete(client)
  gameIdByClient.delete(client)
}
