export type Lambda = () => void

export type RecordKey = string | number | symbol

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
