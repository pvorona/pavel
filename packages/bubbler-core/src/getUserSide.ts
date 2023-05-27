import { Side } from './Side'
import { Game } from './Game'

export function getUserSide(userId: string, game: Game): Side {
  return game.leftUserId === userId ? Side.Left : Side.Right
}
