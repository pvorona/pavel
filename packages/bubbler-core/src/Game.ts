export type Game = {
  readonly id: string
  readonly leftUserId: string
  readonly rightUserId: string
  readonly status: GameStatus
  // readonly status: left won | right won | tie | left surrendered | right surrendered | timeout | disconnect
}

export enum GameStatus {
  WAITING_FOR_OPPONENT,
  IN_PROGRESS,
  ENDED,
}
