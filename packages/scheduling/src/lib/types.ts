import { Lambda } from '@pavel/types'
import { PRIORITY } from './constants'
import { Queue } from '@pavel/data-structures'

export type QueueByPriority = {
  [value in PRIORITY]: Queue<Lambda>
}
