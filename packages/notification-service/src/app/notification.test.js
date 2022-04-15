import fetch from 'node-fetch'

fetch(
  'https://europe-central2-notification-service-347307.cloudfunctions.net/notification',
  {
    method: 'POST',
    body: JSON.stringify({ message: 'Good night' }),
    headers: { authorization: 'fb205aac-97db-1764-8359-4242cbb10c79' },
  },
).catch(console.error)
