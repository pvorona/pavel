import { Side } from './Side'

export type ClientEvent =
  | PlayEvent
  | SurrenderEvent
  | ClientPingEvent
  | ClientPongEvent

export enum ClientEventType {
  Ping,
  Pong,

  Play,
  Surrender,
}

export type PlayEvent = {
  readonly type: ClientEventType.Play
  readonly payload: {
    readonly rowIndex: number
    readonly side: Side
  }
}

export type SurrenderEvent = {
  readonly type: ClientEventType.Surrender
}

export type ClientPingEvent = {
  readonly type: ClientEventType.Ping
}

export type ClientPongEvent = {
  readonly type: ClientEventType.Pong
}

export const CLIENT_PONG_EVENT: ClientPongEvent = {
  type: ClientEventType.Pong,
}
