import { RecordKey } from '@pavel/types'

export enum TYPES {
  LRA,
  LRU,
}

export type Cache<Key extends RecordKey, Value> = {
  get: (key: Key) => Value
  // return value to indicate if new value replaced old one
  set: (key: Key, value: Value) => void
  has: (key: Key) => boolean
}

export type Cached<Key extends RecordKey, Value> = {
  get: (key: Key) => Value
}

export type CacheOptions = Readonly<{
  size: number
  // type: TYPES
}>
