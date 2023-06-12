import { Side } from './Side'

export type ClientMessage = Play | Surrender | ClientPing | ClientPong

export enum ClientMessageType {
  Ping = 'Ping',
  Pong = 'Pong',
  Play = 'Play',
  Surrender = 'Surrender',
}

export type Play = {
  readonly type: ClientMessageType.Play
  readonly payload: {
    readonly y: number
    readonly side: Side
  }
}

export function createPlayMessage(payload: Play['payload']): Play {
  return { type: ClientMessageType.Play, payload }
}

export type Surrender = {
  readonly type: ClientMessageType.Surrender
}

export const SURRENDER_MESSAGE: Surrender = {
  type: ClientMessageType.Surrender,
}

export type ClientPing = {
  readonly type: ClientMessageType.Ping
}

export const CLIENT_PING_MESSAGE: ClientPing = {
  type: ClientMessageType.Ping,
}

export type ClientPong = {
  readonly type: ClientMessageType.Pong
}

export const CLIENT_PONG_MESSAGE: ClientPong = {
  type: ClientMessageType.Pong,
}
