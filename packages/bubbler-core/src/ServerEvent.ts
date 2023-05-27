import { Side } from './Side'

export type ServerEvent =
  | AppendedEvent
  | GameEndedEvent
  | GameStartedEvent
  | ServerPingEvent
  | ServerPongEvent
  | ServerPingEvent
  | ServerPongEvent

export enum ServerEventType {
  Ping,
  Pong,

  Appended,
  GameStarted,
  GameEnded,
}

export enum GameEndReason {
  LeftPlayerLeft,
  LeftPlayerDisconnected,
  LeftPlayerSurrendered,
  RightPlayerLeft,
  RightPlayerDisconnected,
  RightPlayerSurrendered,
  LeftPlayerWon,
  RightPlayerWon,
  Draw,
}

export type GameStartedEvent = {
  readonly type: ServerEventType.GameStarted
  readonly payload: {
    readonly side: Side
    readonly opponentName: string
  }
}

export function createGameStartedEvent(
  payload: GameStartedEvent['payload'],
): GameStartedEvent {
  return {
    type: ServerEventType.GameStarted,
    payload,
  }
}

export type AppendedEvent = {
  readonly type: ServerEventType.Appended
  readonly payload: {
    readonly rowIndex: number
    readonly side: Side
  }
}

export function createAppendedEvent(
  payload: AppendedEvent['payload'],
): AppendedEvent {
  return {
    type: ServerEventType.Appended,
    payload,
  }
}

export type GameEndedEvent = {
  readonly type: ServerEventType.GameEnded
  readonly payload: {
    readonly reason: GameEndReason
  }
}

export function createGameEndedEvent(reason: GameEndReason): GameEndedEvent {
  return {
    type: ServerEventType.GameEnded,
    payload: { reason },
  }
}

export type ServerPingEvent = {
  readonly type: ServerEventType.Ping
}

export type ServerPongEvent = {
  readonly type: ServerEventType.Pong
}

export const SERVER_PONG_EVENT: ServerPongEvent = {
  type: ServerEventType.Pong,
}

export const SERVER_PING_EVENT: ServerPingEvent = {
  type: ServerEventType.Ping,
}
