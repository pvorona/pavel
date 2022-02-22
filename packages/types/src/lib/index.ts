export type Lambda = () => void

export type RecordKey = string | number | symbol

export type Nominal<Source, Label extends string> = Source & {
  __kind__: Label
}
