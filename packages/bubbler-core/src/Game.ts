export type Game = {
  readonly id: string
  readonly leftUserId: string
  readonly rightUserId: string
  // readonly status: left won | right won | tie | left surrendered | right surrendered | timeout | disconnect
}
