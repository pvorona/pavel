import { QueueByPriority } from './types'
import { PRIORITY, PHASE, PRIORITIES_IN_ORDER } from './constants'
import { createQueue } from './createQueue'

let executionFrameId: undefined | number = undefined

export let phase = PHASE.INTERACTING

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
  if (executionFrameId !== undefined) return

  executionFrameId = requestAnimationFrame(performScheduledTasks)
}

function performScheduledTasks() {
  console.log('----FRAME WORK START----')
  phase = PHASE.RENDERING

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

  let anyTaskScheduledDuringExecution = false

  for (const priority of PRIORITIES_IN_ORDER) {
    // Check if not all cancelled
    if (futureQueueByPriority[priority].tasks.length !== 0) {
      anyTaskScheduledDuringExecution = true
      // No need to create new queue
      // Current frame queue already re-initialized
      ;[queueByPriority[priority], futureQueueByPriority[priority]] = [
        futureQueueByPriority[priority],
        queueByPriority[priority],
      ]
    }
  }

  if (anyTaskScheduledDuringExecution) {
    scheduleExecutionIfNeeded()
  }

  phase = PHASE.INTERACTING
  console.log('----FRAME WORK END----')
}

// function swapElements (collection: unknown[], leftIndex:number,rightIndex:number){
//   const temp = collection[leftIndex]
//   collection[leftIndex] =
//   collection[rightIndex]=temp
// }
