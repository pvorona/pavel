import { QueueByPriority } from './types'
import { PRIORITY, PRIORITIES_IN_ORDER } from './constants'
import { createQueue } from './createQueue'

let executionFrameId: undefined | number = undefined

export const queueByPriority: QueueByPriority = {
  [PRIORITY.READ]: createQueue(),
  [PRIORITY.COMPUTE]: createQueue(),
  [PRIORITY.WRITE]: createQueue(),
}

export const futureQueueByPriority: QueueByPriority = {
  [PRIORITY.READ]: createQueue(),
  [PRIORITY.COMPUTE]: createQueue(),
  [PRIORITY.WRITE]: createQueue(),
}

export function scheduleExecutionIfNeeded() {
  if (executionFrameId) return

  executionFrameId = requestAnimationFrame(performScheduledTasks)
}

function performScheduledTasks() {
  for (const priority of PRIORITIES_IN_ORDER) {
    const { tasks, isCancelledByIndex } = queueByPriority[priority]

    for (let i = 0; i < tasks.length; i++) {
      if (isCancelledByIndex[i]) {
        continue
      }

      tasks[i]()
    }

    queueByPriority[priority] = createQueue()
  }

  // Should be cleared before calling `schedulePerformWorkIfNeeded`
  executionFrameId = undefined

  const anyTaskScheduledDuringExecution =
    futureQueueByPriority[PRIORITY.READ].tasks.length !== 0 ||
    futureQueueByPriority[PRIORITY.COMPUTE].tasks.length !== 0 ||
    futureQueueByPriority[PRIORITY.WRITE].tasks.length !== 0

  if (anyTaskScheduledDuringExecution) {
    scheduleExecutionIfNeeded()

    queueByPriority[PRIORITY.READ] = futureQueueByPriority[PRIORITY.READ]
    queueByPriority[PRIORITY.COMPUTE] = futureQueueByPriority[PRIORITY.COMPUTE]
    queueByPriority[PRIORITY.WRITE] = futureQueueByPriority[PRIORITY.WRITE]

    futureQueueByPriority[PRIORITY.READ] = createQueue()
    futureQueueByPriority[PRIORITY.COMPUTE] = createQueue()
    futureQueueByPriority[PRIORITY.WRITE] = createQueue()
  }
}
