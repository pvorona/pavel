import { CURRENCY_API_KEY } from '../config'
import { createHmac } from './createHmac'

export function createMessage(
  destination: string,
  payload: Record<string, unknown>,
) {
  const now = Date.now()

  const request = {
    destination,
    payload,
    correlationId: 0,
    timestamp: now,
    apiKey: CURRENCY_API_KEY,
  }

  const signedRequest = {
    ...request,
    signature: createHmac(request),
  }

  return JSON.stringify(signedRequest)
}
