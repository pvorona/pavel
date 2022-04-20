import { RequestInfo, RequestInit } from 'node-fetch'
import { NOTIFICATION_URL } from '../config'

const fetch = (...args: [url: RequestInfo, init?: RequestInit]) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

export function sendNotification(message: string) {
  return fetch(NOTIFICATION_URL, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { authorization: 'fb205aac-97db-1764-8359-4242cbb10c79' },
  }).catch(error => {
    console.error(
      `[${new Date()}] Failed to send notification ${message}. Error: ${error}`,
    )
  })
}
