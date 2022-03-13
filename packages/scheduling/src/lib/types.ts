import { Lambda } from '@pavel/types'
import { PRIORITY } from './constants'
import { Queue } from '@pavel/utils'

export type QueueByPriority = {
  [value in PRIORITY]: Queue<Lambda>
}
