export type EnabledGraphKeys = {
  readonly [key: string]: boolean
}

export type OpacityState = {
  readonly [key: string]: number
}

export type Point = {
  x: number
  y: number
}

export type Component<Props, Context> = (
  props: Props,
  context: Context,
) => { element: HTMLElement }
