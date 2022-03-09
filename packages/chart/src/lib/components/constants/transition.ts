export const FRAME = 1000 / 60

export const TRANSITION = {
  FAST: FRAME * 2,
  MEDIUM: FRAME * 8,
  SLOW: FRAME * 26,
} as const
