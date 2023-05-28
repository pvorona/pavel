import { Side } from './Side'

export type ServerEvent =
  | PieceAddedEvent
  | DrawEvent
  | WonEvent
  | LostEvent
  | OpponentLeftEvent
  | OpponentSurrenderedEvent
  | OpponentDisconnectedEvent
  | GameStartedEvent
  | ServerPingEvent
  | ServerPongEvent

export enum ServerEventType {
  Ping,
  Pong,

  PieceAdded,
  Draw,
  Won,
  Lost,
  OpponentLeft,
  OpponentSurrendered,
  OpponentDisconnected,

  GameStarted,
  // GameEnded,
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
    // readonly side: Side
    readonly pendingMove: boolean
    // TODO:
    // readonly opponentName: string
    // readonly playStyle: string
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

export type PieceAddedEvent = {
  readonly type: ServerEventType.PieceAdded
  readonly payload: {
    readonly rowIndex: number
    readonly side: Side
  }
}

export function createPieceAddedEvent(
  payload: PieceAddedEvent['payload'],
): PieceAddedEvent {
  return {
    type: ServerEventType.PieceAdded,
    payload,
  }
}

export type DrawEvent = {
  readonly type: ServerEventType.Draw
  readonly payload: {
    readonly rowIndex: number
    readonly side: Side
  }
}

export function createDrawEvent(payload: DrawEvent['payload']): DrawEvent {
  return {
    type: ServerEventType.Draw,
    payload,
  }
}

export type WonEvent = {
  readonly type: ServerEventType.Won
}

export function createWonEvent(): WonEvent {
  return {
    type: ServerEventType.Won,
  }
}

export type LostEvent = {
  readonly type: ServerEventType.Lost
}

export function createLostEvent(): LostEvent {
  return {
    type: ServerEventType.Lost,
  }
}

export type OpponentLeftEvent = {
  readonly type: ServerEventType.OpponentLeft
}

export function createOpponentLeftEvent(): OpponentLeftEvent {
  return {
    type: ServerEventType.OpponentLeft,
  }
}

export type OpponentSurrenderedEvent = {
  readonly type: ServerEventType.OpponentSurrendered
}

export function createOpponentSurrenderedEvent(): OpponentSurrenderedEvent {
  return {
    type: ServerEventType.OpponentSurrendered,
  }
}

export type OpponentDisconnectedEvent = {
  readonly type: ServerEventType.OpponentDisconnected
}

export function createOpponentDisconnectedEvent(): OpponentDisconnectedEvent {
  return {
    type: ServerEventType.OpponentDisconnected,
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
