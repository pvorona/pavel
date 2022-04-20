import { createMessage } from './createMessage'
import { MongoClient } from 'mongodb'
import { omit } from 'lodash'
import { MONGO_DB_NAME, MONGO_URI } from '../config'
import { sendNotification } from './sendNotification'
import { createWebSocket } from './createWebSocket'
import { COLLECTIONS, SYMBOLS, TICKER } from './constants'

const client = new MongoClient(MONGO_URI)

export async function startCollector() {
  try {
    await client.connect()
    const db = client.db(MONGO_DB_NAME)
    await db.command({ ping: 1 })
    const collection = db.collection(COLLECTIONS[TICKER.SP500])

    function connectToSocket() {
      createWebSocket({
        onError: function (error) {
          console.log(
            `Sending notification: [${new Date()}][${
              this.id
            }] Websocket error. ${JSON.stringify(error)}`,
          )
          sendNotification(
            `[${new Date()}][${this.id}] Websocket error. ${JSON.stringify(
              error,
            )}`,
          )
        },
        onClose: function () {
          console.log(
            `Sending notification: [${new Date()}][${
              this.id
            }] Websocket closed`,
          )
          sendNotification(`[${new Date()}][${this.id}] Websocket closed`)
          connectToSocket()
        },
        onOpen: function () {
          const message = createMessage('marketData.subscribe', {
            symbols: [SYMBOLS[TICKER.SP500]],
          })

          this.send(message)
        },
        onMessage: function (data) {
          const message = JSON.parse(data.toString())

          if (message.destination !== 'internal.quote') {
            return
          }

          const { payload } = message
          const document = {
            ...omit(payload, 'symbolName'),
            timestamp: new Date(payload.timestamp),
          }

          collection.insertOne(document).catch(error => {
            console.error(
              `[${new Date()}][${
                this.id
              }] Failed to insert document ${JSON.stringify(document)}.`,
            )
            console.error(error)

            sendNotification(
              `[${new Date()}][${
                this.id
              }] Failed to insert document ${JSON.stringify(document)}`,
            )
          })
        },
      })
    }

    connectToSocket()
  } catch (error) {
    console.error(error)

    await client.close()
  }
}
