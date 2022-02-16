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
  const { isCancelledByIndex, tasks } = getQueue(priority)[priority]
  const nextIndex = tasks.push(task)

  scheduleExecutionIfNeeded()

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}

function getQueue(priority: PRIORITY) {
  if (priority === PRIORITY.BEFORE_RENDER && phase === PHASE.RENDERING) {
    return futureQueueByPriority
  }

  return queueByPriority
}
