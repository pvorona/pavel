import { PRIORITY } from '../constants'
import { queueByPriority, scheduleExecutionIfNeeded } from '../scheduling'
import { Lambda } from '../types'

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const { isCancelledByIndex, tasks } = queueByPriority[priority]
  const nextIndex = tasks.push(task)

  scheduleExecutionIfNeeded()

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}
