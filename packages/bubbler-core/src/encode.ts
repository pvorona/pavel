import { RawData } from 'ws'
import { ClientEvent } from './ClientEvent'
import { ServerEvent } from './ServerEvent'

export type MessageEncoder<Input, Output> = (input: Input) => Output
export type ServerMessageEncoder = MessageEncoder<ServerEvent, Buffer>
export type ClientMessageEncoder = MessageEncoder<ClientEvent, Buffer>

export const encodeServerMessage: ServerMessageEncoder = message => {
  return Buffer.from(JSON.stringify(message), 'utf-8')
}

export function decodeClientMessage(data: RawData): ClientEvent {
  return JSON.parse(data.toString())
}
