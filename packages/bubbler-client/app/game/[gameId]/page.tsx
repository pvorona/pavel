'use client'

import { ensureInBounds, getRandomNumberInRange, times } from '@pavel/utils'
import {
  CLIENT_PONG_MESSAGE,
  FieldSize,
  GAME_ID_SEARCH_PARAM,
  Player,
  SURRENDER_MESSAGE,
  ServerMessage,
  ServerMessageType,
  Side,
  createField,
  createPlayMessage,
  encodeClientMessage,
} from '@pavel/bubbler-core'
import {
  CSSProperties,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  UserContext,
  Button,
  ButtonSize,
  Typography,
} from '../../../components'
import styles from './Game.module.scss'
import classNames from 'classnames'
import { ensureNever } from '@pavel/assert'
import { BUBBLES } from '../../../constants'
import { useQueryClient } from '@tanstack/react-query'

enum ConnectionState {
  Idle = 'Idle',
  Loading = 'Loading',
  Ongoing = 'Ongoing',
  Ended = 'Ended',
}

enum GameState {
  Loading = 'Loading',
  Ongoing = 'Ongoing',
  Won = 'Won',
  Lost = 'Lost',
  Draw = 'Draw',
}

enum OpponentInfo {
  OpponentLeft = 'OpponentLeft',
  OpponentSurrendered = 'OpponentSurrendered',
  OpponentDisconnected = 'OpponentDisconnected',
}

// TODO: highlight winning sequence
// TODO: smart hover, only consider 1/2 of empty cells
// TODO: 2nd player connected to the game after the 1st player surrendered
// TODO: highlight hover move

enum GameError {
  GameNotFound = 'GameNotFound',
  AnotherGameInProgress = 'AnotherGameInProgress',
  Unauthenticated = 'Unauthenticated',
  UserNotFound = 'UserNotFound',
  GameEnded = 'GameEnded',
}

export default function Game({
  params: { gameId },
}: {
  params: { gameId: string }
}) {
  const user = useContext(UserContext)
  const wsRef = useRef<WebSocket>()
  const [error, setError] = useState<GameError | null>(null)
  const [connectionState, setConnectionState] = useState(ConnectionState.Idle)
  const [gameState, setGameState] = useState(GameState.Loading)
  const [opponentInfo, setOpponentInfo] = useState<OpponentInfo | null>(null)
  const [pendingMove, setPendingMove] = useState(false)
  const [fieldElement, setFieldElement] = useState<HTMLDivElement | null>(null)
  const [fieldHovered, setFieldHovered] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<{
    y: number
    side: Side
  } | null>(null)
  const fieldRef = useRef(createField<Player>())
  const [potentialMove, setPotentialMove] = useState<{ x: number; y: number }>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!hoverPosition) {
      return
    }

    const { side, y } = hoverPosition

    const initialX = side === Side.Left ? 0 : FieldSize.X - 1
    for (
      let x = initialX;
      side === Side.Left ? x < FieldSize.X : x >= 0;
      side === Side.Left ? x++ : x--
    ) {
      if (fieldRef.current[y][x] === undefined) {
        setPotentialMove({ x, y })

        break
      }
    }
  }, [hoverPosition])

  useEffect(() => {
    if (!fieldElement) {
      return
    }

    function handleMouseEnter() {
      setFieldHovered(true)
    }
    function handleMouseLeave() {
      setFieldHovered(false)
    }
    function handleMouseMove(event: MouseEvent) {
      if (!fieldElement) {
        return
      }

      const { clientX, clientY } = event
      const { y, side } = getHoverPosition(clientX, clientY, fieldElement)
      console.log({ y, side })
      setHoverPosition({ y, side })
    }

    fieldElement.addEventListener('mouseenter', handleMouseEnter)
    fieldElement.addEventListener('mouseleave', handleMouseLeave)
    fieldElement.addEventListener('mousemove', handleMouseMove)

    return () => {
      fieldElement.removeEventListener('mouseenter', handleMouseEnter)
      fieldElement.removeEventListener('mouseleave', handleMouseLeave)
      fieldElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [fieldElement])

  useEffect(() => {
    if (!user) {
      return
    }

    setConnectionState(ConnectionState.Loading)

    const ws = new WebSocket(
      `ws://localhost:3001/bubbler-server-api?${GAME_ID_SEARCH_PARAM}=${gameId}`,
    )

    ws.addEventListener('open', handleOpen)
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', handleClose)
    ws.addEventListener('error', handleError)

    wsRef.current = ws

    function handleOpen() {
      setConnectionState(ConnectionState.Ongoing)
    }

    function handleMessage(event: MessageEvent) {
      const { data } = event

      console.log(JSON.parse(data))

      let serverEvents: ServerMessage[] = JSON.parse(data)
      if (!Array.isArray(serverEvents)) {
        serverEvents = [serverEvents]
      }

      for (const message of serverEvents) {
        if (message.type === ServerMessageType.GameStarted) {
          setGameState(GameState.Ongoing)
          setPendingMove(message.payload.pendingMove)

          continue
        }

        if (message.type === ServerMessageType.Lost) {
          setGameState(GameState.Lost)

          continue
        }

        if (message.type === ServerMessageType.Draw) {
          setGameState(GameState.Draw)

          continue
        }

        if (message.type === ServerMessageType.Won) {
          setGameState(GameState.Won)

          continue
        }

        if (message.type === ServerMessageType.Ping) {
          const event = CLIENT_PONG_MESSAGE
          const request = encodeClientMessage(event)
          ws.send(request)

          continue
        }

        if (message.type === ServerMessageType.Pong) {
          continue
        }

        if (message.type === ServerMessageType.OpponentDisconnected) {
          setOpponentInfo(OpponentInfo.OpponentDisconnected)

          continue
        }

        if (message.type === ServerMessageType.OpponentLeft) {
          setOpponentInfo(OpponentInfo.OpponentLeft)

          continue
        }

        if (message.type === ServerMessageType.OpponentSurrendered) {
          setOpponentInfo(OpponentInfo.OpponentSurrendered)

          continue
        }

        if (message.type === ServerMessageType.PieceAdded) {
          const {
            payload: { x, y, player },
          } = message

          fieldRef.current[y][x] = player
          setPendingMove(pendingMove => !pendingMove)

          continue
        }

        if (message.type === ServerMessageType.GameNotFound) {
          setError(GameError.GameNotFound)

          continue
        }

        if (message.type === ServerMessageType.Unauthenticated) {
          setError(GameError.Unauthenticated)

          continue
        }

        if (message.type === ServerMessageType.AnotherGameInProgress) {
          setError(GameError.AnotherGameInProgress)

          continue
        }

        if (message.type === ServerMessageType.UserNotFound) {
          setError(GameError.UserNotFound)

          continue
        }

        if (message.type === ServerMessageType.GameEnded) {
          setError(GameError.GameEnded)

          continue
        }

        ensureNever(message)
      }
    }

    function handleClose(event: CloseEvent) {
      setConnectionState(ConnectionState.Ended)
    }

    function handleError(event: Event) {
      setConnectionState(ConnectionState.Ended)
      console.log(event)
    }

    return () => {
      ws.removeEventListener('open', handleOpen)
      ws.removeEventListener('message', handleMessage)
      ws.removeEventListener('close', handleClose)
      ws.removeEventListener('error', handleError)
      ws.close(1000)
      queryClient.invalidateQueries({ queryKey: ['games'] })
    }
  }, [gameId, queryClient, user])

  function handleSurrender() {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      ![ConnectionState.Ongoing, ConnectionState.Loading].includes(
        connectionState,
      )
    ) {
      return
    }

    const event = SURRENDER_MESSAGE
    const request = encodeClientMessage(event)
    wsRef.current.send(request)
  }

  function handleFieldClick(clickEvent: React.MouseEvent<HTMLDivElement>) {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      connectionState !== ConnectionState.Ongoing ||
      !pendingMove ||
      !fieldElement
    ) {
      return
    }

    const { clientX, clientY } = clickEvent
    const { side, y } = getHoverPosition(clientX, clientY, fieldElement)

    const event = createPlayMessage({ y, side })
    const request = encodeClientMessage(event)
    wsRef.current.send(request)
  }

  function getHoverPosition(
    clientX: number,
    clientY: number,
    fieldElement: HTMLDivElement,
  ): { y: number; side: Side } {
    const side =
      clientX - fieldElement.offsetLeft < fieldElement.offsetWidth / 2
        ? Side.Left
        : Side.Right
    const rawY = Math.floor(
      (clientY - fieldElement.offsetTop) /
        (fieldElement.offsetHeight / FieldSize.Y),
    )
    const y = ensureInBounds(rawY, 0, FieldSize.Y - 1)

    return { y, side }
  }

  const title = (() => {
    if (error) {
      if (error === GameError.AnotherGameInProgress) {
        return 'Another game in progress'
      }

      if (error === GameError.Unauthenticated) {
        return 'Unauthenticated'
      }

      if (error === GameError.GameNotFound) {
        return 'Game not found'
      }

      if (error === GameError.UserNotFound) {
        return 'User not found'
      }

      if (error === GameError.GameEnded) {
        return 'Game ended'
      }

      ensureNever(error)
    }

    if (!user) {
      return 'Authorizing...'
    }

    if (connectionState === ConnectionState.Idle) {
      return '\u00A0'
    }

    if (connectionState === ConnectionState.Loading) {
      return 'Connecting...'
    }

    if (connectionState === ConnectionState.Ended) {
      if (gameState === GameState.Loading) {
        return 'Connection closed'
      }

      if (opponentInfo === OpponentInfo.OpponentDisconnected) {
        return 'Opponent disconnected'
      }

      if (opponentInfo === OpponentInfo.OpponentLeft) {
        return 'Opponent left'
      }

      if (opponentInfo === OpponentInfo.OpponentSurrendered) {
        return 'Opponent surrendered'
      }
    }

    if (gameState === GameState.Loading) {
      return 'Waiting for opponent...'
    }

    if (gameState === GameState.Ongoing) {
      if (pendingMove) {
        return 'Your turn'
      }

      return "Opponent's turn"
    }

    if (gameState === GameState.Draw) {
      return 'Draw'
    }

    if (gameState === GameState.Lost) {
      return 'You lost'
    }

    if (gameState === GameState.Won) {
      return 'You won'
    }

    ensureNever(gameState)
  })()

  const CELL_SIZE = 80

  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center h-full',
        styles.Container,
      )}
    >
      <Typography className={classNames('text-7xl mt-8')}>{title}</Typography>

      <div
        className={classNames(
          'flex flex-col items-center justify-center mt-20 relative',
          {
            'cursor-pointer': pendingMove,
            'cursor-wait': !pendingMove,
          },
        )}
        ref={setFieldElement}
        onClick={handleFieldClick}
      >
        <Grid />
        {times(FieldSize.Y, y => (
          <div
            key={y}
            className="flex items-center relative"
            style={{ height: CELL_SIZE }}
          >
            {times(FieldSize.X, x => (
              <div
                key={x}
                style={{ width: CELL_SIZE }}
                className="flex items-center justify-center"
              >
                {(() => {
                  const cell = fieldRef.current[y][x]
                  const className = 'rounded-full'
                  const style: CSSProperties | undefined = (() => {
                    if (cell === undefined) {
                      return {}
                    }

                    if (cell === Player.Current) {
                      const {
                        background: { from, to },
                        border,
                      } = BUBBLES[6]

                      return {
                        background: `linear-gradient(${from}, ${to})`,
                        border: `1px solid ${border}`,
                      }
                    }

                    if (cell === Player.Opponent) {
                      const {
                        background: { from, to },
                        border,
                      } = BUBBLES[7]

                      return {
                        background: `linear-gradient(${from}, ${to})`,
                        border: `1px solid ${border}`,
                      }
                    }
                  })()

                  const potentialMoveClassName = (() => {
                    if (!potentialMove || cell || !pendingMove) {
                      return
                    }

                    if (x === potentialMove.x && y === potentialMove.y) {
                      return 'border-green-600 bg-green-600 opacity-50'
                    }
                  })()

                  return (
                    <div
                      style={{
                        ...style,
                        width: CELL_SIZE * 0.75,
                        height: CELL_SIZE * 0.75,
                      }}
                      className={classNames(className, potentialMoveClassName, {
                        [styles.Circle]: fieldRef.current[y][x],
                      })}
                    />
                  )
                })()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* <div>connection {connectionState}</div>
      <div>game {gameState}</div> */}

      <Button
        disabled={gameState !== GameState.Ongoing}
        size={ButtonSize.Sm}
        onClick={handleSurrender}
        className="mt-auto mb-4"
      >
        Surrender
      </Button>
    </div>
  )
}

const Grid = memo(GridComponent)

const DIFFUSION = 10
const PADDING = 7

function GridComponent() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      vectorEffect="non-scaling-stroke"
    >
      {times(FieldSize.X - 1, index => {
        const dx = 100 / FieldSize.X
        const x = dx * (index + 1)
        const dy = 100 - PADDING * 2

        const cx1 = getRandomNumberInRange(
          x - dx / DIFFUSION,
          x + dx / DIFFUSION,
        )
        const cy1 = getRandomNumberInRange(
          dy / 2 - dy / DIFFUSION,
          dy / 2 + dy / DIFFUSION,
        )
        const cx2 = getRandomNumberInRange(
          cx1 - dx / DIFFUSION,
          cx1 + dx / DIFFUSION,
        )
        const cy2 = getRandomNumberInRange(
          cy1 - dy / DIFFUSION,
          cy1 + dy / DIFFUSION,
        )

        return (
          <path
            key={index}
            d={`M${x.toFixed(2)} ${PADDING} C${cx1.toFixed(2)} ${cy1.toFixed(
              2,
            )}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, ${x.toFixed(2)} ${
              100 - PADDING
            }`}
            stroke="#ec8f0c"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
        )
      })}
      {times(FieldSize.Y - 1, index => {
        const dy = 100 / FieldSize.Y
        const y = dy * (index + 1)
        const dx = 100 - PADDING * 2

        const cx1 = getRandomNumberInRange(
          dx / 2 - dx / DIFFUSION,
          dx / 2 + dx / DIFFUSION,
        )
        const cy1 = getRandomNumberInRange(
          y - dy / DIFFUSION,
          y + dy / DIFFUSION,
        )
        const cx2 = getRandomNumberInRange(
          cx1 - dx / DIFFUSION,
          cx1 + dx / DIFFUSION,
        )
        const cy2 = getRandomNumberInRange(
          cy1 + dy / DIFFUSION,
          cy1 + dy / DIFFUSION,
        )

        return (
          <path
            key={index}
            d={`M${PADDING} ${y.toFixed(2)} C${cx1.toFixed(2)} ${cy1.toFixed(
              2,
            )}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, ${
              100 - PADDING
            } ${y.toFixed(2)}`}
            stroke="#ec8f0c"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
        )
      })}
    </svg>
  )
}
