import { RawData } from 'ws'
import { ClientMessage } from './ClientEvent'
import { ServerMessage } from './ServerEvent'

export type MessageEncoder<Input, Output> = (input: Input) => Output

export type ServerMessageEncoder = MessageEncoder<
  ServerMessage | readonly ServerMessage[],
  string
  // Buffer
>
export type ClientMessageEncoder = MessageEncoder<ClientMessage, Buffer>

export const encodeServerMessage: ServerMessageEncoder = message => {
  console.log(`Encoding message ${JSON.stringify(message)}`)
  // return Buffer.from(JSON.stringify(message), 'utf-8')
  return JSON.stringify(message)
}

export function decodeClientMessage(data: RawData): ClientMessage {
  return JSON.parse(data.toString())
}

export const encodeClientMessage: ClientMessageEncoder = message => {
  return Buffer.from(JSON.stringify(message), 'utf-8')
}
