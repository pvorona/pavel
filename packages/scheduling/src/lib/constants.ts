export enum PRIORITY {
  READ,
  COMPUTE,
  WRITE,
}

export enum PHASE {
  INTERACTING,
  RENDERING,
}

export const PRIORITIES_IN_ORDER = [
  PRIORITY.READ,
  PRIORITY.COMPUTE,
  PRIORITY.WRITE,
]
