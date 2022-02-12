import { QueueByPriority } from './types'
import { PRIORITY, PRIORITIES_IN_ORDER, PHASE } from './constants'
import { createQueue } from './createQueue'

let animationFrameId: undefined | number = undefined
// let idleCallbackId: undefined | number = undefined
export let phase = PHASE.INTERACTING

export const queueByPriority: QueueByPriority = {
  [PRIORITY.BEFORE_RENDER]: createQueue(),
  [PRIORITY.READ]: createQueue(),
  [PRIORITY.COMPUTE]: createQueue(),
  [PRIORITY.WRITE]: createQueue(),
}

// Still useful?
export const futureQueueByPriority: QueueByPriority = {
  [PRIORITY.BEFORE_RENDER]: createQueue(),
  [PRIORITY.READ]: createQueue(),
  [PRIORITY.COMPUTE]: createQueue(),
  [PRIORITY.WRITE]: createQueue(),
}

Object.assign(window, { queueByPriority, futureQueueByPriority })

export function scheduleExecutionIfNeeded() {
  if (animationFrameId) return

  animationFrameId = requestAnimationFrame(performScheduledTasks)
}

function performScheduledTasks() {
  console.log('START------------------')

  phase = PHASE.BEFORE_RENDER

  for (const priority of [PRIORITY.BEFORE_RENDER]) {
    const { tasks, isCancelledByIndex } = queueByPriority[priority]

    for (let i = 0; i < tasks.length; i++) {
      if (isCancelledByIndex[i]) {
        continue
      }

      tasks[i]()
    }

    queueByPriority[priority] = createQueue()
  }

  phase = PHASE.RENDERING

  for (const priority of [PRIORITY.READ, PRIORITY.COMPUTE, PRIORITY.WRITE]) {
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
  animationFrameId = undefined

  const anyTaskScheduledDuringExecution =
    futureQueueByPriority[PRIORITY.BEFORE_RENDER].tasks.length !== 0 ||
    futureQueueByPriority[PRIORITY.READ].tasks.length !== 0 ||
    futureQueueByPriority[PRIORITY.COMPUTE].tasks.length !== 0 ||
    futureQueueByPriority[PRIORITY.WRITE].tasks.length !== 0

  if (anyTaskScheduledDuringExecution) {
    scheduleExecutionIfNeeded()

    queueByPriority[PRIORITY.BEFORE_RENDER] =
      futureQueueByPriority[PRIORITY.BEFORE_RENDER]
    queueByPriority[PRIORITY.READ] = futureQueueByPriority[PRIORITY.READ]
    queueByPriority[PRIORITY.COMPUTE] = futureQueueByPriority[PRIORITY.COMPUTE]
    queueByPriority[PRIORITY.WRITE] = futureQueueByPriority[PRIORITY.WRITE]

    futureQueueByPriority[PRIORITY.BEFORE_RENDER] = createQueue()
    futureQueueByPriority[PRIORITY.READ] = createQueue()
    futureQueueByPriority[PRIORITY.COMPUTE] = createQueue()
    futureQueueByPriority[PRIORITY.WRITE] = createQueue()
  }

  phase = PHASE.INTERACTING

  console.log('------------------END')
}
