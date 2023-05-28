import { Side } from './Side'
import {
  DIRECTIONS,
  FieldSize,
  MAX_MOVE_COUNT,
  MIN_CONSECUTIVE_PIECES,
} from './constants'
import { assert } from '@pavel/assert'

export type CellValue = undefined | string
export type Field = CellValue[][]

export class Board {
  private field = createField()
  private moveCount = 0

  constructor(
    private userIds: readonly string[],
    private currentUserId: string,
  ) {
    assert(userIds.length === 2, 'Invalid number of users')
    assert(userIds.includes(currentUserId), 'Current user is not in userIds')
  }

  play(rowIndex: number, side: Side): PlayResult {
    const initialColIndex = side === Side.Left ? 0 : FieldSize.X - 1
    for (
      let colIndex = initialColIndex;
      side === Side.Left ? colIndex < FieldSize.X : colIndex >= 0;
      side === Side.Left ? colIndex++ : colIndex--
    ) {
      if (this.field[rowIndex] === undefined) {
        this.field[rowIndex][colIndex] = this.currentUserId
        this.moveCount++

        if (this.isWinningMove(colIndex, rowIndex)) {
          return PlayResult.Won
        }

        if (this.moveCount === MAX_MOVE_COUNT) {
          return PlayResult.Draw
        }

        const nextUserIndex =
          (this.userIds.indexOf(this.currentUserId) + 1) % this.userIds.length
        this.currentUserId = this.userIds[nextUserIndex]

        return PlayResult.PieceAdded
      }
    }

    return PlayResult.Unchanged
  }

  getCurrentUserId() {
    return this.currentUserId
  }

  private isWinningMove(x: number, y: number): boolean {
    for (const key in DIRECTIONS) {
      if (
        hasMinConsecutivePieces(
          this.field,
          x,
          y,
          DIRECTIONS[key as keyof typeof DIRECTIONS],
        )
      ) {
        return true
      }
    }

    return false
  }
}

function hasMinConsecutivePieces(
  field: Field,
  x: number,
  y: number,
  directions: readonly (readonly [dx: number, dy: number])[],
): boolean {
  let count = 1
  const isDirectionEnabled = [true, true]

  for (let i = 1; ; i++) {
    for (let j = 0; j < directions.length; j++) {
      if (!isDirectionEnabled[j]) {
        continue
      }

      const [dx, dy] = directions[j]

      if (x + dx * i < 0 || x + dx * i >= FieldSize.X) {
        isDirectionEnabled[j] = false
        continue
      }

      if (y + dy * i < 0 || y + dy * i >= FieldSize.Y) {
        isDirectionEnabled[j] = false
        continue
      }

      if (field[y][x] !== field[y + dy * i][x + dx * i]) {
        isDirectionEnabled[j] = false
        continue
      }

      count++
      if (count >= MIN_CONSECUTIVE_PIECES) return true
    }

    if (!isDirectionEnabled.some(Boolean)) {
      return false
    }
  }
}

function createField(): Field {
  const result = new Array(FieldSize.Y)

  for (let i = 0; i < result.length; i++) {
    result.push(new Array(FieldSize.X))
  }

  return result
}

// TODO: BoardDiff or BoardState
export enum PlayResult {
  Unchanged,
  PieceAdded,
  Draw,
  Won,
}
