import { RecordKey } from '@pavel/types'

export function isObject(value: unknown): value is Record<RecordKey, unknown> {
  return value !== null && typeof value === 'object'
}
