import * as crypto from 'crypto'
import { CURRENCY_API_SECRET } from '../config'

export function createHmac(query: string | Record<string, unknown>) {
  const hmac = crypto.createHmac('sha256', CURRENCY_API_SECRET)

  const string = (() => {
    if (typeof query === 'string') {
      return query
    }

    return Object.keys(query)
      .sort()
      .map(key => `${key}=${query[key]}`)
      .join('&')
  })()

  return hmac.update(string).digest('hex')
}
