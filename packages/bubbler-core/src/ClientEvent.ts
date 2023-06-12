import { Side } from './Side'

export type ClientEvent =
  | PlayEvent
  | SurrenderEvent
  | ClientPingEvent
  | ClientPongEvent

export enum ClientEventType {
  Ping = 'Ping',
  Pong = 'Pong',
  Play = 'Play',
  Surrender = 'Surrender',
}

export type PlayEvent = {
  readonly type: ClientEventType.Play
  readonly payload: {
    readonly y: number
    readonly side: Side
  }
}

export function createPlayEvent(payload: PlayEvent['payload']): PlayEvent {
  return { type: ClientEventType.Play, payload }
}

export type SurrenderEvent = {
  readonly type: ClientEventType.Surrender
}

export const SURRENDER_EVENT: SurrenderEvent = {
  type: ClientEventType.Surrender,
}

export type ClientPingEvent = {
  readonly type: ClientEventType.Ping
}

export const CLIENT_PING_EVENT: ClientPingEvent = {
  type: ClientEventType.Ping,
}

export type ClientPongEvent = {
  readonly type: ClientEventType.Pong
}

export const CLIENT_PONG_EVENT: ClientPongEvent = {
  type: ClientEventType.Pong,
}
