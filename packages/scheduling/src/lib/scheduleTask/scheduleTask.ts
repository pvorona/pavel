import { PHASE } from '..'
import { PRIORITY } from '../constants'
import {
  queueByPriority,
  scheduleExecutionIfNeeded,
  futureQueueByPriority,
  phase,
} from '../scheduling'
import { Lambda } from '../types'

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const queue =
    phase === PHASE.INTERACTING ? queueByPriority : futureQueueByPriority
  const { isCancelledByIndex, tasks } = queue[priority]
  const nextIndex = tasks.push(task)

  if (phase === PHASE.INTERACTING) {
    scheduleExecutionIfNeeded()
  }

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}
