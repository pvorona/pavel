import { RawData } from 'ws'
import { ClientEvent } from './ClientEvent'
import { ServerEvent } from './ServerEvent'

export type MessageEncoder<Input, Output> = (input: Input) => Output

export type ServerMessageEncoder = MessageEncoder<
  ServerEvent | readonly ServerEvent[],
  string
  // Buffer
>
export type ClientMessageEncoder = MessageEncoder<ClientEvent, Buffer>

export const encodeServerMessage: ServerMessageEncoder = message => {
  console.log(`Encoding message ${JSON.stringify(message)}`)
  // return Buffer.from(JSON.stringify(message), 'utf-8')
  return JSON.stringify(message)
}

export function decodeClientMessage(data: RawData): ClientEvent {
  return JSON.parse(data.toString())
}

export const encodeClientMessage: ClientMessageEncoder = message => {
  return Buffer.from(JSON.stringify(message), 'utf-8')
}
