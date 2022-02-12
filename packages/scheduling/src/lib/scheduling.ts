import { swap } from '@pavel/swap'
import { QueueByPriority } from './types'
import { PRIORITIES_IN_ORDER } from './constants'
import { createQueue } from './createQueue'
import { initQueue } from './initQueue'

let executionFrameId: undefined | number = undefined

export const queueByPriority: QueueByPriority = initQueue()
export const futureQueueByPriority: QueueByPriority = initQueue()

export function scheduleExecutionIfNeeded() {
  if (executionFrameId !== undefined) return

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

    if (tasks.length !== 0) {
      queueByPriority[priority] = createQueue()
    }
  }

  // Should be cleared before calling `schedulePerformWorkIfNeeded`
  executionFrameId = undefined

  let anyTaskScheduledDuringRendering = false

  for (const priority of PRIORITIES_IN_ORDER) {
    // TODO: Check if not all cancelled
    if (futureQueueByPriority[priority].tasks.length !== 0) {
      anyTaskScheduledDuringRendering = true
      // No need to create new queue
      // Current frame queue already re-initialized
      swap(queueByPriority, priority, futureQueueByPriority, priority)
    }
  }

  if (anyTaskScheduledDuringRendering) {
    scheduleExecutionIfNeeded()
  }
}
