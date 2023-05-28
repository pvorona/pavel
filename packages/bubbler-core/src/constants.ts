export const GAME_ID_SEARCH_PARAM = 'g'
export const FieldSize = {
  X: 7,
  Y: 7,
}
export const MAX_MOVE_COUNT = FieldSize.X * FieldSize.Y
export const MIN_CONSECUTIVE_PIECES = 4
export const DIRECTIONS = {
  HORIZONTAL: [
    [-1, 0],
    [+1, 0],
  ],
  VERTICAL: [
    [0, -1],
    [0, +1],
  ],
  LEFT_DIAGONAL: [
    [-1, -1],
    [+1, +1],
  ],
  RIGHT_DIAGONAL: [
    [-1, +1],
    [+1, -1],
  ],
} as const
