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
  AddPieceResult,
  EndReason,
  Player,
  OPPONENT_LEFT_EVENT,
  WON_EVENT,
  LOST_EVENT,
  OPPONENT_SURRENDERED_EVENT,
  DRAW_EVENT,
  OPPONENT_DISCONNECTED_EVENT,
  ServerEvent,
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

// TODO: event validation

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
  const userId = String(Math.random())
  const searchParams = new URLSearchParams(request.url?.slice(2))

  if (!searchParams.has(GAME_ID_SEARCH_PARAM)) {
    console.error(
      `Received request without "${GAME_ID_SEARCH_PARAM}" param: ${request.url}`,
    )

    return client.close(1008)
  }

  const gameId = searchParams.get(GAME_ID_SEARCH_PARAM)

  if (!gameId) {
    console.error(
      `User ${userId} tried to connect to server without providing "${GAME_ID_SEARCH_PARAM}" param: ${request.url}`,
    )

    return client.close(1008)
  }

  const game = await db.game.findFirst({ where: { id: gameId } })

  if (!game) {
    console.error(
      `User ${userId} tried to connect to game ${gameId} that doesn't exist`,
    )

    return client.close(1008)
  }

  if (game.status !== GameStatus.WAITING_FOR_OPPONENT) {
    console.error(
      `User ${userId} tried to connect to game ${gameId} that doesn't accept new players`,
    )

    return client.close(1008)
  }

  userIdByClient.set(client, userId)
  lastInteractionTimestampByClient.set(client, Date.now())
  gameIdByClient.set(client, gameId)

  console.log(`${userId} connected to ${gameId}`)

  const clients = getOrInitMap(clientsByGameId, gameId, [])

  clients.push(client)

  if (clients.length === 2) {
    // TODO: Race conditions
    await db.game.update({
      where: { id: gameId },
      data: { status: GameStatus.IN_PROGRESS },
    })
    const userIds = clients.map(client =>
      ensureDefined(userIdByClient.get(client), 'Cannot get userId for client'),
    )
    const startingUserId = getRandomArrayElement(userIds)
    const board = new Board(userIds, startingUserId)

    boardByGameId.set(game.id, board)
    // TODO: WS readyState
    for (const client of clients) {
      const userId = ensureDefined(userIdByClient.get(client))
      const pendingMove = startingUserId === userId
      const event = createGameStartedEvent({ pendingMove })
      console.log(`Sending ${JSON.stringify(event)} to ${userId}`)
      const response = encodeServerMessage(event)
      client.send(response)
    }
  }

  client.on('close', async () => {
    for (const innerClient of clients) {
      if (innerClient !== client) {
        const event = [OPPONENT_LEFT_EVENT, WON_EVENT]
        const response = encodeServerMessage(event)
        innerClient.send(response)
        innerClient.close()
      }

      cleanUpClient(innerClient)
    }

    cleanUpGame(gameId)

    await db.game.update({
      where: { id: gameId },
      data: {
        status: GameStatus.ENDED,
      },
    })
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
            ? LOST_EVENT
            : [OPPONENT_SURRENDERED_EVENT, WON_EVENT]
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

    if (clientEvent.type === ClientEventType.Play) {
      const board = boardByGameId.get(game.id)

      if (!board) {
        console.log(
          `User ${userId} tried to perform a move in a deleted game ${game.id}`,
        )

        return
      }

      if (board.getState().ended) {
        console.log(
          `User ${userId} tried to perform a move in a completed game ${game.id}`,
        )

        return
      }

      if (board.getCurrentUserId() !== userId) {
        console.log(
          `User ${userId} tried to perform a move while it's an opponent's turn`,
        )

        return
      }

      const {
        payload: { y, side },
      } = clientEvent
      const result = board.addPiece(y, side)

      if (result.type === AddPieceResult.Unchanged) {
        console.log(`User ${userId} tried to perform illegal move`)

        return
      }

      if (result.type === AddPieceResult.PieceAdded) {
        const boardState = board.getState()

        let shouldCompleteGame = false
        for (const innerClient of clients) {
          const events = ((): ServerEvent | ServerEvent[] => {
            const playEvent = createPieceAddedEvent({
              x: result.payload.x,
              y: result.payload.y,
              player: innerClient === client ? Player.Current : Player.Opponent,
            })

            if (boardState.ended) {
              shouldCompleteGame = true

              if (boardState.reason === EndReason.Draw) {
                return [playEvent, DRAW_EVENT]
              }

              if (boardState.reason === EndReason.Won) {
                const endEvent = innerClient === client ? WON_EVENT : LOST_EVENT

                return [playEvent, endEvent]
              }

              ensureNever(boardState)
            }

            return playEvent
          })()

          const response = encodeServerMessage(events)
          innerClient.send(response)

          if (shouldCompleteGame) {
            cleanUpClient(client)
          }
        }

        if (shouldCompleteGame) {
          cleanUpGame(game.id)

          await db.game.update({
            where: { id: gameId },
            data: {
              status: GameStatus.ENDED,
            },
          })
        }

        return
      }

      ensureNever(result)
    }

    console.error(
      `Received unknown message ${JSON.stringify(clientEvent)} from ${userId}`,
    )
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
        const event = OPPONENT_DISCONNECTED_EVENT
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
