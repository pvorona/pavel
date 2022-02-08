export interface EnabledGraphNames {
  [key: string]: boolean
}

export interface OpacityState {
  [key: string]: number
}

export interface Point {
  x: number
  y: number
}

export type Component<Props, Context> = (
  p: Props,
  c: Context,
) => { element: HTMLElement }