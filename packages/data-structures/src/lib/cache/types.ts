import { RecordKey } from '@pavel/types'

export enum TYPES {
  LRA,
  LRU,
}

// type None = {}
// type Some<T> = { value: T }

// type Option<T> = Some<T> | None

// type LookupResult<T> =
//   | {
//       status: 'found'
//       value: T
//     }
//   | {
//       status: 'not found'
//     }

export type Cache<Key extends RecordKey, Value> = {
  get: (key: Key) => Value
  // get: (key: Key) => Option<Value>
  // get: (key: Key) => Value | undefined
  // delete: (key: Key) => void
  // return value to indicate if new value replaced old one
  set: (key: Key, value: Value) => void
  has: (key: Key) => boolean
}

export type Cached<Key extends RecordKey, Value> = {
  get: (key: Key) => Value
}

export type CacheOptions = Readonly<{
  max: number
  // type: TYPES
}>
