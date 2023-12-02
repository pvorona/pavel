export type ServerMessage =
  | PieceAdded
  | Draw
  | Won
  | Lost
  | OpponentLeft
  | OpponentSurrendered
  | OpponentDisconnected
  | GameStarted
  | ServerPing
  | ServerPong
  | AnotherGameInProgress
  | GameNotFound
  | Unauthenticated
  | UserNotFound
  | GameEnded
  | GamePaused
  | GameUnpaused

export enum ServerMessageType {
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
  AnotherGameInProgress = 'AnotherGameInProgress',
  GameNotFound = 'GameNotFound',
  Unauthenticated = 'Unauthenticated',
  UserNotFound = 'UserNotFound',
  GameEnded = 'GameEnded',
  GamePaused = 'GamePaused',
  GameUnpaused = 'GameUnpaused',
}

export enum Player {
  Current = 'Current',
  Opponent = 'Opponent',
}

export type GameStarted = {
  readonly type: ServerMessageType.GameStarted
  readonly payload: {
    // readonly side: Side
    readonly pendingMove: boolean
    // TODO:
    // readonly opponentName: string
    // readonly playStyle: string
  }
}

export function createGameStartedMessage(
  payload: GameStarted['payload'],
): GameStarted {
  return {
    type: ServerMessageType.GameStarted,
    payload,
  }
}

export type PieceAdded = {
  readonly type: ServerMessageType.PieceAdded
  readonly payload: {
    readonly y: number
    readonly x: number
    readonly player: Player
  }
}

export function createPieceAddedMessage(
  payload: PieceAdded['payload'],
): PieceAdded {
  return {
    type: ServerMessageType.PieceAdded,
    payload,
  }
}

export type Draw = {
  readonly type: ServerMessageType.Draw
}

export const DRAW_MESSAGE: Draw = {
  type: ServerMessageType.Draw,
}

export type Won = {
  readonly type: ServerMessageType.Won
}

export const WON_MESSAGE: Won = {
  type: ServerMessageType.Won,
}

export type Lost = {
  readonly type: ServerMessageType.Lost
}

export const LOST_MESSAGE: Lost = {
  type: ServerMessageType.Lost,
}

export type OpponentLeft = {
  readonly type: ServerMessageType.OpponentLeft
}

export const OPPONENT_LEFT_MESSAGE: OpponentLeft = {
  type: ServerMessageType.OpponentLeft,
}

export type OpponentSurrendered = {
  readonly type: ServerMessageType.OpponentSurrendered
}

export const OPPONENT_SURRENDERED_MESSAGE: OpponentSurrendered = {
  type: ServerMessageType.OpponentSurrendered,
}

export type OpponentDisconnected = {
  readonly type: ServerMessageType.OpponentDisconnected
}

export const OPPONENT_DISCONNECTED_MESSAGE: OpponentDisconnected = {
  type: ServerMessageType.OpponentDisconnected,
}

export type ServerPing = {
  readonly type: ServerMessageType.Ping
}

export type ServerPong = {
  readonly type: ServerMessageType.Pong
}

export const SERVER_PONG_MESSAGE: ServerPong = {
  type: ServerMessageType.Pong,
}

export const SERVER_PING_MESSAGE: ServerPing = {
  type: ServerMessageType.Ping,
}

export type AnotherGameInProgress = {
  readonly type: ServerMessageType.AnotherGameInProgress
}

export const ANOTHER_GAME_IN_PROGRESS_MESSAGE: AnotherGameInProgress = {
  type: ServerMessageType.AnotherGameInProgress,
}

export type GameNotFound = {
  readonly type: ServerMessageType.GameNotFound
}

export const GAME_NOT_FOUND_MESSAGE: GameNotFound = {
  type: ServerMessageType.GameNotFound,
}

export type GameEnded = {
  readonly type: ServerMessageType.GameEnded
}

export const GAME_ENDED_MESSAGE: GameEnded = {
  type: ServerMessageType.GameEnded,
}

export type Unauthenticated = {
  readonly type: ServerMessageType.Unauthenticated
}

export const UNAUTHENTICATED_MESSAGE: Unauthenticated = {
  type: ServerMessageType.Unauthenticated,
}

export type UserNotFound = {
  readonly type: ServerMessageType.UserNotFound
}

export const USER_NOT_FOUND_MESSAGE: UserNotFound = {
  type: ServerMessageType.UserNotFound,
}

export type GamePaused = {
  readonly type: ServerMessageType.GamePaused
}

export const GAME_PAUSED_MESSAGE: GamePaused = {
  type: ServerMessageType.GamePaused,
}

export type GameUnpaused = {
  readonly type: ServerMessageType.GameUnpaused
}

export const GAME_UNPAUSED_MESSAGE: GameUnpaused = {
  type: ServerMessageType.GameUnpaused,
}
