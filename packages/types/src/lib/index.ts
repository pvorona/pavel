export type Lambda = () => void

export type RecordKey = string | number | symbol

export type Nominal<Source, Type extends string> = Source & {
  [Symbol.species]: Type
}

export type AnyRecord = Record<RecordKey, unknown>

export enum LoadingStatus {
  IDLE,
  IN_PROGRESS,
  COMPLETED,
  FAILED,
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>
    }
  : T
