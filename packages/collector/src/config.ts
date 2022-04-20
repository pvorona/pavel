import 'dotenv/config'
import { ensureString } from '@pavel/assert'

export const CURRENCY_API_URL = ensureString(process.env.CURRENCY_API_URL)
export const CURRENCY_WS_API_URL = ensureString(process.env.CURRENCY_WS_API_URL)
export const CURRENCY_API_KEY = ensureString(process.env.CURRENCY_API_KEY)
export const CURRENCY_API_SECRET = ensureString(process.env.CURRENCY_API_SECRET)
export const MONGO_URI = ensureString(process.env.MONGO_URI)
export const MONGO_DB_NAME = ensureString(process.env.MONGO_DB_NAME)
export const NOTIFICATION_URL = ensureString(process.env.NOTIFICATION_URL)
