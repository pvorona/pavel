import fetch from 'node-fetch'

export function sendNotification(message: string) {
  return fetch(
    'https://europe-central2-notification-service-347307.cloudfunctions.net/notification',
    {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { authorization: 'fb205aac-97db-1764-8359-4242cbb10c79' },
    },
  )
}
