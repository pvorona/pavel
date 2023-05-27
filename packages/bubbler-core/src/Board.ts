import { Side } from './Side'
import { FieldSize, MAX_MOVE_COUNT } from './constants'
import { assert } from '@pavel/assert'

export type CellValue = undefined | string
export type Field = CellValue[][]

export class Board {
  private field = createField()
  private moveCount = 0

  constructor(private userIds: string[], private currentUserId: string) {
    assert(userIds.length === 2, 'Invalid number of users')
    assert(userIds.includes(currentUserId), 'Current user is not in users')
  }

  move(rowIndex: number, side: Side): MoveResult {
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
          return MoveResult.Won
        }

        if (this.moveCount === MAX_MOVE_COUNT) {
          return MoveResult.Draw
        }

        this.currentUserId =
          this.userIds[
            (this.userIds.indexOf(this.currentUserId) + 1) % this.userIds.length
          ]

        return MoveResult.Moved
      }
    }

    return MoveResult.Unchanged
  }

  getCurrentUserId() {
    return this.currentUserId
  }

  private isWinningMove(x: number, y: number): boolean {
    // TODO: implement
  }
}

function createField(): Field {
  const result = new Array(FieldSize.Y)

  for (let i = 0; i < result.length; i++) {
    result.push(new Array(FieldSize.X))
  }

  return result
}

export enum MoveResult {
  Unchanged,
  Moved,
  Draw,
  Won,
}
