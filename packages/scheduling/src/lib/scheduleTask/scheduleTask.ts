import { PRIORITY, URGENCY } from '../constants'
import {
  queueByPriority,
  scheduleExecutionIfNeeded,
  futureQueueByPriority,
} from '../scheduling'
import { Lambda } from '../types'

export function scheduleTask(
  task: Lambda,
  priority = PRIORITY.WRITE,
  urgency = URGENCY.CURRENT_FRAME,
): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const queue =
    urgency === URGENCY.CURRENT_FRAME ? queueByPriority : futureQueueByPriority
  const { isCancelledByIndex, tasks } = queue[priority]
  const nextIndex = tasks.push(task)

  scheduleExecutionIfNeeded()

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}
