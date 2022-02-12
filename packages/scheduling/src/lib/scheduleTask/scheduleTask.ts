import { futureQueueByPriority } from '..'
import { PRIORITY, PHASE } from '../constants'
import {
  queueByPriority,
  scheduleExecutionIfNeeded,
  phase,
} from '../scheduling'
import { Lambda } from '../types'

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const { isCancelledByIndex, tasks } = getQueue()[priority]
  const nextIndex = tasks.push(task)

  scheduleExecutionIfNeeded()

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }

  function getQueue() {
    if (priority === PRIORITY.BEFORE_RENDER && phase === PHASE.RENDERING) {
      return futureQueueByPriority
    }

    return queueByPriority
  }
}
