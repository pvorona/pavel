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
  Ping = 'Ping',
  Pong = 'Pong',
  PieceAdded = 'PieceAdded',
  Draw = 'Draw',
  Won = 'Won',
  Lost = 'Lost',
  OpponentLeft = 'OpponentLeft',
  OpponentSurrendered = 'OpponentSurrendered',
  OpponentDisconnected = 'OpponentDisconnected',
  GameStarted = 'GameStarted',
}

export enum Player {
  Current = 'Current',
  Opponent = 'Opponent',
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
    readonly y: number
    readonly x: number
    readonly player: Player
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
}

export const DRAW_EVENT: DrawEvent = {
  type: ServerEventType.Draw,
}

export type WonEvent = {
  readonly type: ServerEventType.Won
}

export const WON_EVENT: WonEvent = {
  type: ServerEventType.Won,
}

export type LostEvent = {
  readonly type: ServerEventType.Lost
}

export const LOST_EVENT: LostEvent = {
  type: ServerEventType.Lost,
}

export type OpponentLeftEvent = {
  readonly type: ServerEventType.OpponentLeft
}

export const OPPONENT_LEFT_EVENT: OpponentLeftEvent = {
  type: ServerEventType.OpponentLeft,
}

export type OpponentSurrenderedEvent = {
  readonly type: ServerEventType.OpponentSurrendered
}

export const OPPONENT_SURRENDERED_EVENT: OpponentSurrenderedEvent = {
  type: ServerEventType.OpponentSurrendered,
}

export type OpponentDisconnectedEvent = {
  readonly type: ServerEventType.OpponentDisconnected
}

export const OPPONENT_DISCONNECTED_EVENT: OpponentDisconnectedEvent = {
  type: ServerEventType.OpponentDisconnected,
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
