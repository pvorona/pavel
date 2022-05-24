export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export enum THEME {
  LIGHT = 0,
  DARK = 1,
}

export type Cursor = 'ew-resize' | 'grabbing' | ''
export const cursor: Record<string, Cursor> = {
  resize: 'ew-resize',
  grabbing: 'grabbing',
  default: '',
} as const

export const DOT_BORDER_SIZE = 0
export const DOT_SIZE = 10
export const CENTER_OFFSET = -DOT_SIZE / 2 - DOT_BORDER_SIZE

export const MIN_HEIGHT = 0

export const WHEEL_CLEAR_TIMEOUT = 50

export const MIN_VIEWBOX_MS = 10

export const WHEEL_SPEED = 0.001

export const DEVIATION_FROM_STRAIGHT_LINE_DEGREES = 45

export const DEFAULT_MARKER_LINE_WIDTH = 2

export const DEFAULT_MARKER_COLOR = '#2EB086'
