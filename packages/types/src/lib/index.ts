export type Lambda = () => void

export type RecordKey = string | number | symbol

export type Nominal<Source, Type extends string> = Source & {
  __TYPE__: Type
}

export type AnyRecord = Record<RecordKey, unknown>
