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

export enum EndReason {
  WonLost,
  Draw,
}

export type BoardState =
  | {
      ended: true
      reason: EndReason.Draw
    }
  | {
      ended: true
      reason: EndReason.WonLost
      winner: string
    }
  | {
      ended: false
    }

// TODO: BoardDiff or BoardState
export enum AddPieceResult {
  Unchanged,
  PieceAdded,
  Draw,
  Won,
}

const BOARD_UNCHANGED = { type: AddPieceResult.Unchanged } as const

export class Board {
  private field = createField()
  private moveCount = 0
  private state: BoardState

  constructor(
    private userIds: readonly string[],
    private currentUserId: string,
  ) {
    assert(userIds.length === 2, 'Invalid number of users')
    assert(userIds.includes(currentUserId), 'Current user is not in userIds')

    this.state =
      this.moveCount === MAX_MOVE_COUNT
        ? { ended: true, reason: EndReason.Draw }
        : { ended: false }
  }

  addPiece(y: number, side: Side) {
    if (this.state.ended) {
      return BOARD_UNCHANGED
    }

    const initialX = side === Side.Left ? 0 : FieldSize.X - 1
    for (
      let x = initialX;
      side === Side.Left ? x < FieldSize.X : x >= 0;
      side === Side.Left ? x++ : x--
    ) {
      if (this.field[y][x] === undefined) {
        this.field[y][x] = this.currentUserId
        this.moveCount++

        if (this.moveCount === MAX_MOVE_COUNT) {
          this.state = { ended: true, reason: EndReason.Draw }

          return { type: AddPieceResult.PieceAdded, payload: { x, y } } as const
        }

        if (this.isWinningMove(x, y)) {
          this.state = {
            ended: true,
            reason: EndReason.WonLost,
            winner: this.currentUserId,
          }

          return { type: AddPieceResult.PieceAdded, payload: { x, y } } as const
        }

        const nextUserIndex =
          (this.userIds.indexOf(this.currentUserId) + 1) % this.userIds.length
        this.currentUserId = this.userIds[nextUserIndex]

        return { type: AddPieceResult.PieceAdded, payload: { x, y } } as const
      }
    }

    return BOARD_UNCHANGED
  }

  getCurrentUserId() {
    return this.currentUserId
  }

  getState() {
    return this.state
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

export function createField<T = CellValue>(): (T | undefined)[][] {
  const result = new Array(FieldSize.Y)

  for (let i = 0; i < result.length; i++) {
    result[i] = new Array(FieldSize.X)
  }

  return result
}
