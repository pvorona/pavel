import { PRIORITY, PHASE } from '../constants'
import {
  queueByPriority,
  scheduleExecutionIfNeeded,
  futureQueueByPriority,
  phase,
} from '../scheduling'
import { Lambda } from '@pavel/types'

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const queue = getQueue(priority)[priority]

  const node = queue.enqueue(task)

  scheduleExecutionIfNeeded()

  return function cancelTask() {
    queue.removeNode(node)
  }
}

function getQueue(priority: PRIORITY) {
  if (priority === PRIORITY.BEFORE_RENDER && phase === PHASE.RENDERING) {
    return futureQueueByPriority
  }

  return queueByPriority
}
