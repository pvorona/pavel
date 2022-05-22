export interface EnabledGraphNames {
  readonly [key: string]: boolean
}

export type OpacityState = {
  readonly [key: string]: number
}

export interface Point {
  x: number
  y: number
}

export type Component<Props, Context> = (
  p: Props,
  c: Context,
) => { element: HTMLElement }
