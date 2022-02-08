export const FRAME = 1000 / 60

export const Transition = {
  Fast: FRAME * 2,
  Medium: FRAME * 8,
  Slow: FRAME * 26,
} as const