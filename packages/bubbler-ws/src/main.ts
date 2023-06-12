import { ensureDefined, ensureNever } from '@pavel/assert'
import { parse } from 'cookie'
import { getOrInitMap, getRandomArrayElement } from '@pavel/utils'
import { WebSocket, WebSocketServer } from 'ws'
import {
  ClientMessageType,
  createGameStartedMessage,
  encodeServerMessage,
  GAME_ID_SEARCH_PARAM,
  SERVER_PONG_MESSAGE,
  decodeClientMessage,
  SERVER_PING_MESSAGE,
  createPieceAddedMessage,
  Board,
  AddPieceResult,
  EndReason,
  Player,
  OPPONENT_LEFT_MESSAGE,
  WON_MESSAGE,
  LOST_MESSAGE,
  OPPONENT_SURRENDERED_MESSAGE,
  DRAW_MESSAGE,
  OPPONENT_DISCONNECTED_MESSAGE,
  ServerMessage,
  ANOTHER_GAME_IN_PROGRESS_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  UNAUTHENTICATED_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  GAME_ENDED_MESSAGE,
} from '@pavel/bubbler-core'
import {
  PING_INTERVAL_MILLIS,
  DROP_CONNECTION_TIMEOUT_MILLIS,
  CHECK_DROPPED_CONNECTION_INTERVAL_MILLIS,
} from './constants'
import { db } from '@pavel/bubbler-server'
import { GameStatus } from '@prisma/client'
import express from 'express'

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3001

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
const connectedUserIds = new Set<string>()
const boardByGameId = new Map<string, Board>()
const lastInteractionTimestampByClient = new Map<WebSocket, number>()

startPingingInactiveClients()
startClosingInactiveClients()

// TODO: socket readyState

webSocketServer.on('connection', async (client, request) => {
  const { bubbler } = parse(request.headers.cookie ?? '')

  if (!bubbler) {
    console.error(`Unauthenticated connection attempt`)

    const message = encodeServerMessage(UNAUTHENTICATED_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  const user = await db.user.findFirst({ where: { id: bubbler } })

  if (!user) {
    console.error(`Connection attempt without matching user`)

    const message = encodeServerMessage(USER_NOT_FOUND_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  const { id: userId } = user

  if (connectedUserIds.has(userId)) {
    console.error(
      `User ${userId} tried to connect to a game while he is inside another game`,
    )

    const message = encodeServerMessage(ANOTHER_GAME_IN_PROGRESS_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  const url = `ws://${host}:${port}/${request.url}`
  const { searchParams } = new URL(url)
  const gameId = searchParams.get(GAME_ID_SEARCH_PARAM)

  if (!gameId) {
    console.error(
      `User ${userId} tried to connect to server without providing "${GAME_ID_SEARCH_PARAM}" param: ${url}`,
    )

    const message = encodeServerMessage(GAME_NOT_FOUND_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  const game = await db.game.findFirst({ where: { id: gameId } })

  if (!game) {
    console.error(
      `User ${userId} tried to connect to game ${gameId} that doesn't exist`,
    )

    const message = encodeServerMessage(GAME_NOT_FOUND_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  if (game.status !== GameStatus.WAITING_FOR_OPPONENT) {
    console.error(
      `User ${userId} tried to connect to game ${gameId} that doesn't accept new players`,
    )

    const message = encodeServerMessage(GAME_ENDED_MESSAGE)
    client.send(message)
    return client.close(1008)
  }

  userIdByClient.set(client, userId)
  lastInteractionTimestampByClient.set(client, Date.now())
  gameIdByClient.set(client, gameId)
  connectedUserIds.add(userId)

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
      const message = createGameStartedMessage({ pendingMove })
      const encodedMessage = encodeServerMessage(message)
      client.send(encodedMessage)
    }
  }

  // TODO user disconnected from the game that did not start yet
  client.on('close', async () => {
    // TODO handle connecting to game state
    for (const innerClient of clients) {
      if (innerClient !== client) {
        const messages = [OPPONENT_LEFT_MESSAGE, WON_MESSAGE]
        const encodedMessage = encodeServerMessage(messages)
        innerClient.send(encodedMessage)
        innerClient.close(1000)
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

    const clientMessage = decodeClientMessage(data)

    if (clientMessage.type === ClientMessageType.Ping) {
      const message = encodeServerMessage(SERVER_PONG_MESSAGE)
      client.send(message)

      return
    }

    if (clientMessage.type === ClientMessageType.Pong) {
      return
    }

    if (clientMessage.type === ClientMessageType.Surrender) {
      // TODO handle game connecting state
      for (const innerClient of clients) {
        const messages =
          innerClient === client
            ? LOST_MESSAGE
            : [OPPONENT_SURRENDERED_MESSAGE, WON_MESSAGE]
        const encodedMessage = encodeServerMessage(messages)
        innerClient.send(encodedMessage)
        innerClient.close(1000)
      }

      return
    }

    if (clientMessage.type === ClientMessageType.Play) {
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
      } = clientMessage
      const result = board.addPiece(y, side)

      if (result.type === AddPieceResult.Unchanged) {
        console.log(`User ${userId} tried to perform illegal move`)

        return
      }

      if (result.type === AddPieceResult.PieceAdded) {
        const boardState = board.getState()

        let shouldCompleteGame = false
        for (const innerClient of clients) {
          const messages: ServerMessage | ServerMessage[] = (() => {
            const playMessage = createPieceAddedMessage({
              x: result.payload.x,
              y: result.payload.y,
              player: innerClient === client ? Player.Current : Player.Opponent,
            })

            if (boardState.ended) {
              shouldCompleteGame = true

              if (boardState.reason === EndReason.Draw) {
                return [playMessage, DRAW_MESSAGE]
              }

              if (boardState.reason === EndReason.WonLost) {
                const endMessage =
                  innerClient === client ? WON_MESSAGE : LOST_MESSAGE

                return [playMessage, endMessage]
              }

              ensureNever(boardState)
            }

            return playMessage
          })()

          const encodedMessage = encodeServerMessage(messages)
          innerClient.send(encodedMessage)
        }

        if (shouldCompleteGame) {
          cleanUpGame(game.id)

          await db.game.update({
            where: { id: gameId },
            data: {
              status: GameStatus.ENDED,
            },
          })

          for (const innerClient of clients) {
            innerClient.close(1000)
          }
        }

        return
      }

      ensureNever(result)
    }

    console.error(
      `Received unknown message ${JSON.stringify(
        clientMessage,
      )} from ${userId}`,
    )
  })

  client.on('error', console.error)
})

function startPingingInactiveClients() {
  return setInterval(() => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByClient) {
      if (now - timestamp > PING_INTERVAL_MILLIS) {
        const message = encodeServerMessage(SERVER_PING_MESSAGE)
        client.send(message)
      }
    }
  }, PING_INTERVAL_MILLIS)
}

function startClosingInactiveClients() {
  return setInterval(async () => {
    const now = Date.now()

    for (const [client, timestamp] of lastInteractionTimestampByClient) {
      if (now - timestamp > DROP_CONNECTION_TIMEOUT_MILLIS) {
        const gameId = ensureDefined(gameIdByClient.get(client))
        const clients = ensureDefined(clientsByGameId.get(gameId))
        // TODO CHECK IF WE NEED TO provide lost reason

        for (const innerClient of clients) {
          if (innerClient === client) {
            const message = encodeServerMessage(LOST_MESSAGE)
            innerClient.send(message)
            innerClient.terminate()
            cleanUpClient(innerClient)

            continue
          }

          const message = encodeServerMessage([
            OPPONENT_DISCONNECTED_MESSAGE,
            WON_MESSAGE,
          ])
          innerClient.send(message)
          innerClient.close(1000)
        }
      }
    }
  }, CHECK_DROPPED_CONNECTION_INTERVAL_MILLIS)
}

function cleanUpGame(gameId: string) {
  console.log(`Cleanup game ${gameId}`)
  clientsByGameId.delete(gameId)
  boardByGameId.delete(gameId)
}

function cleanUpClient(client: WebSocket) {
  const userId = userIdByClient.get(client)

  if (!userId) {
    return
  }

  console.log(`Cleanup client for ${userId}`)
  connectedUserIds.delete(userId)
  userIdByClient.delete(client)
  lastInteractionTimestampByClient.delete(client)
  gameIdByClient.delete(client)
}
