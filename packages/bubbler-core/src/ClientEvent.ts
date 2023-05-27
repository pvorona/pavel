import { Side } from './Side'

export type ClientEvent =
  | AppendEvent
  | SurrenderEvent
  | ClientPingEvent
  | ClientPongEvent

export enum ClientEventType {
  Ping,
  Pong,

  Append,
  Surrender,
}

export type AppendEvent = {
  readonly type: ClientEventType.Append
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
