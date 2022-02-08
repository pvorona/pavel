import { PRIORITY } from './constants'

export type Lambda = () => void

export type QueueByPriority = {
  [value in PRIORITY]: {
    tasks: Lambda[]
    isCancelledByIndex: { [index: number]: boolean }
  }
}
